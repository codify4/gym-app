import { Pool } from "pg";
import { auth } from "./lib/auth";
import { User as SupabaseUser } from "@supabase/supabase-js";
 
type User = SupabaseUser & {
	is_super_admin: boolean;
	raw_user_meta_data: {
		name: string;
		avatar_url: string;
	};
	encrypted_password: string;
	email_confirmed_at: string;
	created_at: string;
	updated_at: string;
	is_anonymous: boolean;
	identities: {
		provider: string;
		identity_data: {
			sub: string;
			email: string;
		};
		created_at: string;
		updated_at: string;
	};
};
 
const migrateFromSupabase = async () => {
	const ctx = await auth.$context;
	const db = ctx.options.database as Pool;
	const users = await db
		.query(`
			SELECT 
				u.*,
				COALESCE(
					json_agg(
						i.* ORDER BY i.id
					) FILTER (WHERE i.id IS NOT NULL),
					'[]'::json
				) as identities
			FROM auth.users u
			LEFT JOIN auth.identities i ON u.id = i.user_id
			GROUP BY u.id
		`)
		.then((res) => res.rows as User[]);
	const supabaseToBetterAuthIdMap = new Map<string, string>();

	for (const user of users) {
		if (!user.email) continue;
	
		const createdUser = await ctx.adapter
			.create({
				model: "user",
				data: {
					email: user.email,
					name: user.raw_user_meta_data.name,
					role: user.is_super_admin ? "admin" : user.role,
					emailVerified: !!user.email_confirmed_at,
					image: user.raw_user_meta_data.avatar_url,
					createdAt: new Date(user.created_at),
					updatedAt: new Date(user.updated_at),
					isAnonymous: user.is_anonymous,
				},
			})
			.catch(() => null);
	
		if (!createdUser) continue;
	
		// Store mapping from Supabase ID to Better Auth ID
		supabaseToBetterAuthIdMap.set(user.id, createdUser.id);
	
		const existingAccounts = await ctx.internalAdapter.findAccounts(createdUser.id);
	
		for (const identity of user.identities) {
			if (identity.provider === "email") {
				const hasCredential = existingAccounts.find((a) => a.providerId === "credential");
				if (!hasCredential) {
					await ctx.adapter.create({
						model: "account",
						data: {
							userId: createdUser.id,
							providerId: "credential",
							accountId: user.id,
							password: user.encrypted_password,
							createdAt: new Date(user.created_at),
							updatedAt: new Date(user.updated_at),
						},
					}).catch(() => {});
				}
			}
	
			const supportedProviders = Object.keys(ctx.options.socialProviders || {});
			if (supportedProviders.includes(identity.provider)) {
				const hasAccount = existingAccounts.find((a) => a.providerId === identity.provider);
				if (!hasAccount) {
					await ctx.adapter.create({
						model: "account",
						data: {
							userId: createdUser.id,
							providerId: identity.provider,
							accountId: identity.identity_data?.sub,
							createdAt: new Date(identity.created_at ?? user.created_at),
							updatedAt: new Date(identity.updated_at ?? user.updated_at),
						},
					});
				}
			}
		}
	}
}

migrateFromSupabase();
import { Dumbbell, Footprints, Activity, BicepsFlexed } from 'lucide-react-native';

export const getWorkoutIcon = (title: string) => {
    const title_lower = title.toLowerCase();
    if (title_lower.includes('chest')) return Dumbbell;
    if (title_lower.includes('leg') || title_lower.includes('lower')) return Footprints;
    if (title_lower.includes('back')) return Dumbbell;
    if (title_lower.includes('shoulder')) return Dumbbell;
    if (title_lower.includes('arm') || title_lower.includes('bicep') || title_lower.includes('tricep')) return BicepsFlexed;
    if (title_lower.includes('core') || title_lower.includes('ab')) return Activity;
    if (title_lower.includes('cardio')) return Activity;
    return Dumbbell;
};
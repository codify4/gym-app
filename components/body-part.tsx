import { View, Text, Image, TouchableOpacity } from 'react-native'

type BodyPartProps = {
    part: { name: string; image: any };
    selectedBodyPart: string;
    setSelectedBodyPart: (bodyPart: string) => void;
};

const BodyPartButton = ({ part, selectedBodyPart, setSelectedBodyPart }: BodyPartProps) => {
    return (
        <TouchableOpacity
            className={`bg-neutral-800 rounded-2xl p-4 mb-4 ${
                selectedBodyPart === part.name ? "bg-neutral-700 border border-white" : ""
            }`}
            style={{ width: "31%" }}
            onPress={() => setSelectedBodyPart(part.name)}
        >
            <View className="items-center">
                <Image source={part.image} resizeMode="contain" style={{ width: 50, height: 50 }} />
                <Text className="text-white text-sm mt-2 font-poppins-semibold">{part.name}</Text>
            </View>
        </TouchableOpacity>
    )
}
export default BodyPartButton
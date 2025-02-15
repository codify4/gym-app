import { TextInput } from 'react-native-paper'

type InputProps = {
    mode: 'outlined' | 'flat'
    value: string
    onChangeText: (text: string) => void
    placeholder: string | undefined
}

const Input = ({ mode, value, onChangeText, placeholder }: InputProps) => {
    return (
        <TextInput
            mode={mode}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            placeholderClassName='font-poppins'
            style={{ height: 60 }}
            theme={{
                colors: {
                    primary: 'white',
                    text: 'white',
                    placeholder: '#9ca3af',
                    background: '#262626'
                },
                roundness: 10
                }
            }
            autoFocus
        />
    )
}
export default Input
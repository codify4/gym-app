import { TextInput } from 'react-native-paper'

type InputProps = {
    mode: 'outlined' | 'flat'
    value: string
    onChangeText: (text: string) => void
    placeholder: string | undefined
    focus?: boolean
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'number-pad' | 'name-phone-pad' | 'decimal-pad' | 'twitter' | 'web-search'
    moreStyles?: object
}

const Input = ({ mode, value, onChangeText, placeholder, focus, keyboardType, moreStyles }: InputProps) => {
    return (
        <TextInput
            mode={mode}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            placeholderClassName='font-poppins'
            style={{ height: 60, ...moreStyles }}
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
            autoFocus={focus ? true : false}
            keyboardType={keyboardType}
        />
    )
}
export default Input
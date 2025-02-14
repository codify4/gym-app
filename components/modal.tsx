import { Modal as RNModal, ModalProps, KeyboardAvoidingView, View, Platform } from 'react-native'

type Props = ModalProps & {
    isOpen: boolean
    withInput?: boolean
}

const Modal = ({isOpen, withInput,  children, ...rest}: Props) => {
    const content = withInput ? (
        <KeyboardAvoidingView 
            className='items-center justify-center flex-1 px-3 bg-neutral-800/40'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {children}
        </KeyboardAvoidingView>
    ):  (
        <View className='items-center justify-center flex-1 px-3 bg-neutral-800/40'>
            {children}
        </View>
    )

    return (
        <RNModal
            visible={isOpen}
            transparent
            animationType='slide'
            statusBarTranslucent
            {...rest}
        >
            {content}
        </RNModal>
    )
}

export default Modal
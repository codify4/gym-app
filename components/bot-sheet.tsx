import { forwardRef } from "react"
import { StyleSheet } from "react-native"
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const BotSheet = forwardRef(({ children }: { children: React.ReactNode }, ref: any) => {
    return (
        <>
            <BottomSheet 
                ref={ref} 
                snapPoints={["90%"]} 
                index={-1} 
                enablePanDownToClose
                handleStyle={{ backgroundColor: "#1e1e1e", borderTopLeftRadius: 40, borderTopRightRadius: 40, }} 
                handleIndicatorStyle={{ backgroundColor: "white" }} 
                backgroundStyle={{
                    backgroundColor: "#1e1e1e", 
                    borderTopLeftRadius: 40, 
                    borderTopRightRadius: 40,
                }}
                containerStyle={{display: "flex", flex: 1, alignItems: "center", justifyContent: "center"}}  
            >
                <BottomSheetView style={styles.contentContainer}>
                    {children}
                </BottomSheetView>
            </BottomSheet>
        </>
    )
})

const styles = StyleSheet.create({
    contentContainer: {
      flex: 1,
      padding: 20,
      alignItems: "center",
      backgroundColor: "#1e1e1e",
    },
});

export default BotSheet
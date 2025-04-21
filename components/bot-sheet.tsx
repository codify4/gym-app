import React from "react";
import { forwardRef } from "react"
import { StyleSheet } from "react-native"
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

const BotSheet = forwardRef(({ children, snapPoints }: { children: React.ReactNode, snapPoints: string[] }, ref: any) => {
    const renderBackdrop = (props: any) => (
        <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.7}
            pressBehavior="close"
            style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0, 0, 0, 0.7)" }]}
        />
      )
    return (
        <>
            <BottomSheet 
                ref={ref} 
                snapPoints={snapPoints}
                index={-1} 
                enablePanDownToClose
                // backdropComponent={renderBackdrop}
                handleStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 40, borderTopRightRadius: 50, }} 
                handleIndicatorStyle={{ backgroundColor: "white" }} 
                backgroundStyle={{
                    backgroundColor: "#171717", 
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
      backgroundColor: "#171717",
    },
});

export default BotSheet
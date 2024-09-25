import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { icons } from '@/constants';
import Map from './Map';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';


const RideLayout = ({ title, children, snapPoints } : {title: string; children: React.ReactNode; snapPoints: string[] }) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    return (
    <GestureHandlerRootView>
      <View className='flex bg-white'>
        <View className='flex flex-col h-full bg-blue-400 '>
            <View className='flex flex-row absolute z-10 top-16 items-center justify-start px-5 ' >
                <TouchableOpacity onPress={() => router.back()} >
                    <View className='w-10 bg-white rounded-full items-center justify-center'>
                        <Image 
                            source={icons.backArrow} 
                            resizeMode='contain'
                            className='w-6 h-6'    
                            />
                    </View>
                </TouchableOpacity>
                <Text className='text-xl ml-2 rounded-full p-1' >{title || 'Go Back'}</Text>
            </View>
            <Map/>
        </View>

        <BottomSheet 
            keyboardBehavior='extend'
            snapPoints={ snapPoints || ['40%' , '85%' ]}
            ref={bottomSheetRef} 
            index={0}
        >
            <BottomSheetScrollView 
                style={{ flex:1 , padding: 20 }}
            >
            {children}
            </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  )
}

export default RideLayout
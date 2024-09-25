import { useAuth, useUser } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RideCard from '@/components/RideCard';
import { icons, images } from '@/constants';
import GoogleTextInput from '@/components/GoogleTextInput';
import Map from '@/components/Map';
import { useLocationStore } from '@/store';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useFetch } from '@/lib/fetch';




export default function Page() {
  const { user } = useUser();
  const { setUserLocation , setDestinationLocation, userAddress } = useLocationStore()
  const [hasPermission, setHasPermission] = useState(false)
  const { signOut } = useAuth();

  const { data: recentRides, loading} = useFetch(`/(api)/ride/${user?.id}`)


  const handleSignOut = () => {
    signOut();
    router.replace('/(auth)/sign-in');
  }

  const handleDestinaitionPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);

    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    const requestLocation = async() => {
      let {status} = await Location.requestForegroundPermissionsAsync();

      if(status !== 'granted') {
        setHasPermission(false)
        return;
      }

      let location = await Location.getCurrentPositionAsync();

      const address = await Location.reverseGeocodeAsync({
        latitude : location.coords?.latitude!,
        longitude : location.coords?.longitude!,
      });

      setUserLocation({
        latitude : location.coords.latitude,
        longitude :location.coords.longitude ,
        address : `${address[0].name}, ${address[0].region}`,
      })
    };

    requestLocation();
  },[] )
  
  return (
    <SafeAreaView className='bg-general-500'>
      <FlatList 
        data={recentRides?.slice(0, 5)} 
        renderItem={({ item }) => <RideCard ride = { item } />}
        className='p-5'
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ListEmptyComponent={() => (
          <View className='flx flex-col justify-center items-center'>
              {!loading ? (
                <>
                  <Image 
                    source={images.noResult}
                    className='w-40 h-40'
                    alt='No recent rides found'
                    resizeMode='contain'
                  />
                  <Text className='text-sm'>
                    No recents rides found
                  </Text>
                </>
              ) : (
                <ActivityIndicator size="small" color="#000" />
              )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className='flex flex-row items-center justify-between my-5'>
              <Text className='text-2xl font-JakartaBold'>
                Welcome, {user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]} {"  "} 👋 
              </Text>
              <TouchableOpacity onPress={handleSignOut} className='justify-center items-center w-8 h-8 rounded-full bg-red-200 '>
                <Image source= {icons.out} className='w-4 h-4' />
              </TouchableOpacity>
            </View>



            {/* Google Text Input */}

            <GoogleTextInput
              icon= {icons.search}
              containerStyle = 'bg-white shadow-md shadow-neural-300'
              handlePress = {handleDestinaitionPress}
            />

            <>
              <Text className='text-xl font-JakartaBold mt-5 mb-4'>
                Your current Location
              </Text>

              <View className='flex flex-row items-center bg-transparent h-[300px]'>
                <Map />
              </View>
            </>
            <Text className='text-xl font-JakartaBold mt-5 mb-4'>
               Recents Rides
              </Text>
          </>
        )}
      />
    </SafeAreaView>
  )
}
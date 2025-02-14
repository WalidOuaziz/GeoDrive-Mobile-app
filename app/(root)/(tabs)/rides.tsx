import { useUser } from '@clerk/clerk-expo';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RideCard from '@/components/RideCard';
import { images } from '@/constants';
import { useFetch } from '@/lib/fetch';
import { Ride } from '@/types/type';


const Rides = () => {

  const { user } = useUser();
  const { data: recentRides, loading} = useFetch<Ride>(`/(api)/ride/${user?.id}`)

  return (
    <SafeAreaView className='bg-general-500'>
      <FlatList 
        data={recentRides} 
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
            <Text className='text-2xl my-5 font-JakartaExtraBold'>All rides</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Rides;

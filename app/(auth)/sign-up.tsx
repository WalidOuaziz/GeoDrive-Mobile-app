import { Text, View, ScrollView, Image, Alert } from "react-native";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";
import OAuth from '../../components/OAuth';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { ReactNativeModal } from 'react-native-modal';
import { fetchAPI } from "../../lib/fetch";
import { name } from "../(api)/user+api";


const onSignUpPress = async () => {};

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isShowSuccessModal, setIsShowSuccessModal] = useState(false)
  const router = useRouter();
  const [verification, setVerification] = useState({
    state : 'default',
    error : '',
    code : ''
  });


  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress : form.email,
        password : form.password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setVerification({
        ...verification,
        state : 'pending'
      });

    } catch (err: any) {
      Alert.alert('Error' , err.errors[0].longMessage)
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code : verification.code,
      })

      if (completeSignUp.status === 'complete') {

        // TODO : Create a USer databae
        await fetchAPI('/(api)/user',{
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });

        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ 
          ...verification,
          state : 'success',
         });

      } else {
        setVerification({ 
          ...verification,
          error : 'verification failed',
          state : 'failed'
         });
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      setVerification({ 
        ...verification,
        error : err.errors[0].longMessage ,
        state : 'failed'
       });
      console.error(JSON.stringify(err, null, 2))
    }
  }
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px] " />
          <Text className="text-2xl text-black font-JakartaBold absolute bottom-0 left-5">
            Create your account
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Sing Up"
            onPress={onSignUpPress}
            className="mt-8"
          />



          {/*  Auth  */}

          <OAuth/>

          <Link href = '/sign-in' className='text-lg text-center text-general-200 mt-10' >
            <Text>Already have an account? </Text>
            <Text className="text-primary-400" > Log In</Text>
          </Link>

          
          {/*  Verefication Medel  */}

          <ReactNativeModal 
          isVisible = {verification.state === 'pending'}
          onModalHide = {() => {
            if(verification.state === 'success') setIsShowSuccessModal(true)
            } 
          }
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] flex ">
            <Text className="text-center text-2xl font-JakartaBold">
              Verification
            </Text>
            <Text className="text-center text-sm font-JakartaBold text-gray-400 mt-3">
              We have sent a verefication code to {form.email}
            </Text>
            <InputField 
             label="Code"
             icon={icons.lock}
             placeholder="12345"
             value={verification.code}
             keyboardType="numeric"
             onChangeText={(code) => setVerification({...verification, code})}
            />

            {verification.error && 
            <Text className="text-red-500 mt-5 text-sm">
              {verification.error}
            </Text>
            }

            <CustomButton 
              title="Verify code"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
            </View>
          </ReactNativeModal>


          <ReactNativeModal isVisible = { isShowSuccessModal }>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] flex justify-center items-center" >
              <Image source={images.check} className=" w-[100px] h-[100px] mx-5" />
              <Text className="text-center text-2xl font-JakartaBold">
              Verified
            </Text>
            <Text className="text-center text-sm font-JakartaBold text-gray-400 mt-3">
              You have successfuly verified your account
            </Text>

            <CustomButton 
              title="Browse home"
              onPress={() => {
                setIsShowSuccessModal(false)
                router.push('/(root)/(tabs)/home')
              }
            }
              className="mt-5"
            />
            </View>
            
          </ReactNativeModal>
          
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;

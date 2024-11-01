import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ImageBackground, View, Text, Button, Image, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';

const Stack = createStackNavigator();

const coursePrices: Record<string, number> = {
  "First Aid": 1500,
  "Sewing": 1500,
  "Life Skills": 1500,
  "Landscaping": 1500,
  "Child Minding": 750,
  "Cooking": 750,
  "Garden Maintaining": 750,
};

const courseImages: Record<string, any> = {
  "First Aid": require('./assets/aidfirst.png'),
  "Sewing": require('./assets/sews.jpg'),
  "Life Skills": require('./assets/lifeskills.png'),
  "Landscaping": require('./assets/land.jpg'),
  "Child Minding": require('./assets/minding.jpg'),
  "Cooking": require('./assets/cooks.jpg'),
  "Garden Maintaining": require('./assets/garden.jpg'),
};


const SplashScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('./assets/begginning.png')}
        style={{
          width: 393, 
          height: 500, 
          flex: 1, 
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'lightgrey',
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          
        </View>
      </ImageBackground>
    </View>
  );
};



const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user && user.username === values.username && user.password === values.password) {
        Alert.alert("Success", "Logged in successfully!");
        navigation.navigate('Home');
      } else {
        Alert.alert("Error", "Invalid username or password.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={handleLogin}
      validationSchema={Yup.object().shape({
        username: Yup.string().required('Please enter your username or email.'),
        password: Yup.string().required('Please enter your password.'),
      })}
    >
      {({ handleChange, handleSubmit, errors, touched }) => (
        <ScrollView 
          contentContainerStyle={{ 
            flex: 1, 
            justifyContent: 'center', 
            paddingVertical: 50, 
            backgroundColor: '#D3D3D3',
          }}
        >
          
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Image
              source={require('./assets/Screenshot (62).png')}
              style={{ width: 130, height: 130, borderRadius: 90 }} 
            />
          </View>

          
          <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
            <TextInput
              placeholder="Username or Email"
              onChangeText={handleChange('username')}
              style={{
                height: 50,
                borderColor: 'black',
                borderWidth: 1,
                marginBottom: 10,
                paddingHorizontal: 15,
                borderRadius: 8,
                backgroundColor: '#fff'
              }}
            />
            {errors.username && touched.username && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.username}</Text>}

            <TextInput
              placeholder="Password"
              onChangeText={handleChange('password')}
              secureTextEntry
              style={{
                height: 50,
                borderColor: 'black',
                borderWidth: 1,
                paddingHorizontal: 15,
                borderRadius: 8,
                backgroundColor: '#fff'
              }}
            />
            {errors.password && touched.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>}
          </View>

          
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity
              onPress={handleSubmit as any}
              style={[
                {
                  width: '100%',
                  paddingVertical: 15,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey',
                  marginBottom: 10,
                },
                isLoading && { backgroundColor: '#777' }
              ]}
              disabled={isLoading}
            >
              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>{isLoading ? "Logging in..." : "Login"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ marginTop: 15, color: '#007BFF', textAlign: 'center' }}>Don't have an account? Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      setProfileImage(pickerResult.uri);
    }
  };

  const handleRegister = async (values: { username: string; email: string; password: string }) => {
    await AsyncStorage.setItem('user', JSON.stringify(values));
    Alert.alert("Success", "Account created successfully!");
    navigation.navigate('Login');
  };

  return (
    <Formik
      initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
      onSubmit={handleRegister}
      validationSchema={Yup.object().shape({
        username: Yup.string().required('Please enter username'),
        email: Yup.string().email('Invalid email').required('Please enter email'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Please enter password'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Please confirm your password'),
      })}
    >
      {({ handleChange, handleSubmit, errors, touched }) => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f7f7f7' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30 }}>Create an Account</Text>

          <TouchableOpacity onPress={handleImagePick}>
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 50 }} />
              ) : (
                <Text>Pick Profile Image</Text>
              )}
            </View>
          </TouchableOpacity>

          <TextInput
            placeholder="Username"
            onChangeText={handleChange('username')}
            style={{ height: 50, borderColor: '#ddd', borderWidth: 1, marginBottom: 10, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#fff' }}
          />
          {errors.username && touched.username && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.username}</Text>}

          <TextInput
            placeholder="Email"
            onChangeText={handleChange('email')}
            keyboardType="email-address"
            style={{ height: 50, borderColor: '#ddd', borderWidth: 1, marginBottom: 10, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#fff' }}
          />
          {errors.email && touched.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>}

          <TextInput
            placeholder="Password"
            onChangeText={handleChange('password')}
            secureTextEntry
            style={{ height: 50, borderColor: '#ddd', borderWidth: 1, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#fff' }}
          />
          {errors.password && touched.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>}

          <TextInput
            placeholder="Confirm Password"
            onChangeText={handleChange('confirmPassword')}
            secureTextEntry
            style={{ height: 50, borderColor: '#ddd', borderWidth: 1, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#fff' }}
          />
          {errors.confirmPassword && touched.confirmPassword && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.confirmPassword}</Text>}

          <Button onPress={handleSubmit} title="Register" color="#000" />

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ marginTop: 10, color: '#007BFF', textAlign: 'center' }}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

const HomeScreen = ({ navigation }: { navigation: any }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#D3D3D3' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30 }}>Please choose a Course</Text>

    <TouchableOpacity style={{ width: '100%', height: 240, marginBottom: 80 }} onPress={() => navigation.navigate('SixMonthCourses')}>
      <Image source={require('./assets/teamwork.jpg')} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
      <Text style={{ textAlign: 'center', marginTop: 12, fontSize: 25 }}>Six-Month Courses here</Text>
    </TouchableOpacity>

    <TouchableOpacity style={{ width: '100%', height: 200, marginBottom: 40 }} onPress={() => navigation.navigate('SixWeekCourses')}>
      <Image source={require('./assets/desk.jpg')} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
      <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 25 }}>Six-Week Courses here</Text>
    </TouchableOpacity>
  </View>
);




const SixMonthCoursesScreen = ({ navigation }: { navigation: any }) => (
  <View style={{ flex: 1, backgroundColor: '#D3D3D3', padding: 20 }}>
    <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'black', marginBottom: 20 }}>Six-Month Courses</Text>
    {["First Aid", "Sewing", "Life Skills", "Landscaping"].map((course) => (
      <CourseCard 
        key={course} 
        course={course} 
        price={coursePrices[course]} 
        image={courseImages[course]} 
        navigation={navigation} 
      />
    ))}
  </View>
);



const SixWeekCoursesScreen = ({ navigation }: { navigation: any }) => (
  <View style={{ flex: 1, backgroundColor: '#D3D3D3', padding: 20 }}>
    <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'black', marginBottom: 20 }}>Six-Week Courses</Text>
    {["Child Minding", "Cooking", "Garden Maintaining"].map((course) => (
      <CourseCard 
        key={course} 
        course={course} 
        price={coursePrices[course]} 
        image={courseImages[course]} 
        navigation={navigation} 
      />
    ))}
  </View>
);


const CourseCard = ({ course, price, image, navigation }: { course: string; price: number; image: any; navigation: any }) => (
  <TouchableOpacity 
    onPress={() => navigation.navigate('CourseDetails', { course })} 
    style={{
      flexDirection: 'row',
      backgroundColor: '#C0C0C0',
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 5,
    }}
  >
    <Image 
      source={image} 
      style={{
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 15,
        resizeMode: 'cover',
      }} 
    />
    
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{course}</Text>
      <Text style={{ fontSize: 16, color: '#888' }}>{price} Rand</Text>
    </View>
    
    <TouchableOpacity 
      onPress={() => navigation.navigate('CourseDetails', { course })} 
      style={{
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#000',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Details</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);


const CourseDetailsScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const { course } = route.params;
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const checkEnrollment = async () => {
      const storedCourses = await AsyncStorage.getItem('selectedCourses');
      const enrolledCourses = storedCourses ? JSON.parse(storedCourses) : [];
      setIsEnrolled(enrolledCourses.includes(course));
    };
    checkEnrollment();
  }, [course]);

  const handleEnroll = async () => {
    const storedCourses = await AsyncStorage.getItem('selectedCourses');
    let enrolledCourses = storedCourses ? JSON.parse(storedCourses) : [];

    if (isEnrolled) {
      enrolledCourses = enrolledCourses.filter((c: string) => c !== course);
    } else {
      enrolledCourses.push(course);
    }

    await AsyncStorage.setItem('selectedCourses', JSON.stringify(enrolledCourses));
    setIsEnrolled(!isEnrolled);
  };

  const courseDetails = {
    "First Aid": {
      purpose: "To provide first aid awareness and basic life support.",
      content: [
        "Wounds and bleeding",
        "Burns and fractures",
        "Emergency scene management",
        "Cardio-Pulmonary Resuscitation (CPR)",
        "Respiratory distress (e.g., choking, blocked airway)"
      ],
    },
    "Sewing": {
      purpose: "To provide alterations and new garment tailoring services.",
      content: [
        "Types of stitches",
        "Threading a sewing machine",
        "Sewing buttons, zips, hems, and seams",
        "Alterations",
        "Designing and sewing new garments"
      ],
    },
    "Life Skills": {
      purpose: "To provide skills to navigate basic life necessities.",
      content: [
        "Opening a bank account",
        "Basic labor law (know your rights)",
        "Basic reading and writing literacy",
        "Basic numeric literacy"
      ],
    },
    "Landscaping": {
      purpose: "To provide knowledge about garden landscaping.",
      content: [
        "Watering, pruning, and planting",
        "Planting techniques",
        "Garden maintenance"
      ],
    },
    "Child Minding": {
      purpose: "To provide basic child and baby care.",
      content: [
        "Birth to six-month baby needs",
        "Seven-month to one-year needs",
        "Toddler needs",
        "Educational toys"
      ],
    },
    "Cooking": {
      purpose: "To teach the basics of cooking.",
      content: [
        "Meal planning",
        "Healthy cooking methods",
        "Baking techniques",
        "Safety in the kitchen"
      ],
    },
    "Garden Maintaining": {
      purpose: "To provide basic knowledge of watering, pruning, and planting.",
      content: [
        "Water restrictions",
        "Pruning techniques",
        "Propagation of plants"
      ],
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7f7', padding: 20, alignItems: 'center' }}>
      <Image source={courseImages[course]} style={{ width: 200, height: 200, borderRadius: 10, marginBottom: 20, resizeMode: 'cover' }} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>{course}</Text>
      <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 }}>
        Purpose: {courseDetails[course].purpose}
        {"\n\n"}
        Course Content: {courseDetails[course].content.join(', ')}
      </Text>
      <TouchableOpacity 
        onPress={handleEnroll}
        style={{
          backgroundColor: '#000',
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{isEnrolled ? "Unenroll" : "Enroll"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const CalculateFeesScreen = ({ navigation }: { navigation: any }) => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [totalFees, setTotalFees] = useState(0);

  useEffect(() => {
    const getSelectedCourses = async () => {
      const courses = await AsyncStorage.getItem('selectedCourses');
      const parsedCourses = courses ? JSON.parse(courses) : [];
      setSelectedCourses(parsedCourses);
      const fees = parsedCourses.reduce((sum, course) => sum + coursePrices[course], 0);
      setTotalFees(fees);
    };
    getSelectedCourses();
  }, []);

  const removeCourse = async (courseToRemove: string) => {
    const updatedCourses = selectedCourses.filter(course => course !== courseToRemove);
    setSelectedCourses(updatedCourses);
    await AsyncStorage.setItem('selectedCourses', JSON.stringify(updatedCourses));
    const updatedFees = updatedCourses.reduce((sum, course) => sum + coursePrices[course], 0);
    setTotalFees(updatedFees);
  };

  const handleProceedToEnroll = () => {
   
    Alert.alert(
      "Congratulations!",
      `You have officially enrolled in the following courses: ${selectedCourses.join(', ')}`
    );

    setSelectedCourses([]);
    setTotalFees(0);
    AsyncStorage.removeItem('selectedCourses'); 

    
    navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7f7', padding: 20 }}>
      
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 15 }}>Selected Courses:</Text>
      {selectedCourses.map((course) => (
        <View key={course} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ fontSize: 16, color: '#333' }}>{course} - {coursePrices[course]} Rand</Text>
          <TouchableOpacity 
            style={{ backgroundColor: '#FF6347', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 }}
            onPress={() => removeCourse(course)}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      
      
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 }}>Total Fees: {totalFees} Rand</Text>

     
      <TouchableOpacity 
        style={{
          backgroundColor: '#0099FF',
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 10,
          alignItems: 'center',
        }}
        onPress={handleProceedToEnroll}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Enroll</Text>
      </TouchableOpacity>
    </View>
  );
};

const PurchaseScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const { selectedCourses, totalFees } = route.params; 
  const [paymentMethod, setPaymentMethod] = useState<string>('Card');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvc: '' });

  const handlePayment = () => {
    if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvc) {
      Alert.alert('Error', 'Please enter complete card details.');
      return;
    }

    Alert.alert('Payment Successful', `You have successfully paid for ${selectedCourses.join(', ')} with ${paymentMethod}. Total: ${totalFees} Rand`);

    navigation.navigate('Home');  
  };

  return (
    <View style={styles.paymentContainer}>
      <Text>Total Fees: {totalFees} Rand</Text> 
      <Text>Selected Courses: {selectedCourses.join(', ')}</Text> 

      <Text>Select Payment Method:</Text>
      <View style={styles.paymentOptions}>
        <TouchableOpacity onPress={() => setPaymentMethod('Card')}>
          <Text style={styles.paymentText}>Card</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPaymentMethod('E-Wallet')}>
          <Text style={styles.paymentText}>E-Wallet</Text>
        </TouchableOpacity>
      </View>

      {paymentMethod === 'Card' && (
        <View>
          <TextInput
            placeholder="Card Number"
            keyboardType="numeric"
            onChangeText={(text) => setCardDetails({ ...cardDetails, cardNumber: text })}
            value={cardDetails.cardNumber}
          />
          <TextInput
            placeholder="Expiry (MM/YY)"
            keyboardType="numeric"
            onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })}
            value={cardDetails.expiry}
          />
          <TextInput
            placeholder="CVC"
            keyboardType="numeric"
            onChangeText={(text) => setCardDetails({ ...cardDetails, cvc: text })}
            value={cardDetails.cvc}
          />
        </View>
      )}

      <Button title="Pay Now" onPress={handlePayment} />
    </View>
  );
};


const AboutUsScreen = () => (
  <View style={{
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
    alignItems: 'center',
  }}>
    <Text style={{
      fontSize: 32,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
    }}>
      About Us
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 15,
    }}>
      Precious Radebe, a passionate advocate for social empowerment, founded Empowering the Nation in 2018 to uplift domestic workers and gardeners in South Africa.
    </Text>
    <Text style={{
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    }}>
      Our Mission
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 15,
    }}>
      We provide essential skills and knowledge to help improve the lives of domestic workers and gardeners. Our programs focus on practical training, skill-building, and personal growth to create better job opportunities and financial stability.
    </Text>
    <Text style={{
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    }}>
      Why We Were Created and put together
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 15,
    }}>
      Understanding the struggles faced by many in these roles, Precious saw the need for upskilling programs that enhance job performance, foster confidence, and open new career paths.
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 20,
    }}>
      Through this initiative, we are dedicated to empowering individuals to reach their full potential. Thank you for learning about our mission.
    </Text>
    <Image
      source={require('./assets/preciousradebe.png')} 
      style={{
        width: 245,
        height: 223,
        borderRadius: 15, 
        resizeMode: 'cover',
      }}
    />
  </View>
);

const ContactUsScreen = () => (
  <View style={{
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
    alignItems: 'center',
  }}>
    <Text style={{
      fontSize: 32,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
    }}>
      Contact Us
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 10,
    }}>
      Phone Number:
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#333',
      marginBottom: 15,
    }}>
      021 713 4983
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 10,
    }}>
      Email Address:
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#333',
      marginBottom: 15,
    }}>
      contact@etn.co.za
    </Text>
    <Text style={{
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    }}>
      Kensington Office
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      marginBottom: 15,
    }}>
      63 Roberts Avenue, Kensington, Johannesburg, 2101
    </Text>
    <Text style={{
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    }}>
      Parktown Office
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      marginBottom: 15,
    }}>
      6 Victoria Avenue, Parktown, Johannesburg, 2193
    </Text>
    <Text style={{
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    }}>
      Mayfair Office
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#666',
      marginBottom: 15,
    }}>
      102 Central Road, Mayfair, Johannesburg, 2108
    </Text>
    <Image
      source={require('./assets/location.png')}
      style={{
        width: 245,
        height: 223,
        borderRadius: 15,
        resizeMode: 'cover',
        marginTop: 20,
      }}
    />
  </View>
);


const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SixMonthCourses" component={SixMonthCoursesScreen} />
      <Stack.Screen name="SixWeekCourses" component={SixWeekCoursesScreen} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
      <Stack.Screen name="CalculateFees" component={CalculateFeesScreen} />
      <Stack.Screen name="Purchase" component={PurchaseScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  splashScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
  },
  formContainer: {
    padding: 25,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#2c2c2e', 
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30, 
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#fff',
    borderWidth: 3,
  },
  profileImagePlaceholder: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 60,
    textAlign: 'center',
    color: '#fff', 
  },
  input: {
    height: 45,
    borderColor: '#555',
    borderWidth: 1.5,
    marginBottom: 15,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#1f1f21', 
    color: '#fff', 
  },
  error: {
    color: '#ff4d4d', 
  },
  loginText: {
    marginTop: 20,
    color: '#0a84ff', 
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1d', 
  },
  courseContainer: {
    padding: 25,
    backgroundColor: '#3a3a3c', 
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  courseTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff', 
    marginBottom: 25,
  },
  card: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 0,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#2e2e30', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  courseImage: {
    width: 110,
    height: 110,
    borderRadius: 10,
  },
  courseDetailContainer: {
    padding: 25,
    alignItems: 'center',
  },
  detailImage: {
    width: 160,
    height: 160,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 2,
  },
  courseDetailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
  },
  courseDetailText: {
    textAlign: 'center',
    color: '#b3b3b3', 
    marginBottom: 25,
  },
  feesContainer: {
    padding: 25,
    alignItems: 'center',
  },
  paymentContainer: {
    padding: 25,
    alignItems: 'center',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  paymentText: {
    padding: 15,
    borderWidth: 1.5,
    borderColor: '#666',
    borderRadius: 10,
    backgroundColor: '#3b3b3d',
    color: '#fff', 
  },
  aboutContainer: {
    padding: 25,
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FFFFED', 
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  buttonText: {
    color: 'black', 
    fontWeight: 'bold',
    fontSize: 17,
  },
});


export default App;
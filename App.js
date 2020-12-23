import React, { useState, useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin'
import auth from '@react-native-firebase/auth'

export default () => {

  const [loggedIn, setloggedIn] = useState(false)
  const [user, setUser] = useState([])

  _signIn = async () => {
    try {
      console.log("Sign in pressed")
      await GoogleSignin.hasPlayServices()
      const { accessToken, idToken } = await GoogleSignin.signIn()
      setloggedIn(true)
      const credential = auth.GoogleAuthProvider.credential(idToken, accessToken)
      console.log("credential ", credential)
      auth().signInWithCredential(credential)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('Cancel')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE')
      } else {
        alert('Unknown error occured!')
      }
    }
  }

  function onAuthStateChanged(user) {
    setUser(user)
    console.log(user)
    if (user) setloggedIn(true)
  }

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId: '230768366320-irsr77f937o0lgdgcc13g2ogq5d0jbve.apps.googleusercontent.com',
      offlineAccess: true,
    });
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    console.log("useEffect running")
    return subscriber
  }, [])

  signOut = async () => {
    try {
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
      auth()
        .signOut()
        .then(() => alert('Your are signed out!'));
      setloggedIn(false);
      setuser([])
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>

      {!loggedIn && (
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this._signIn}
        />
      )}

      {!user && <Text>You are currently logged out</Text>}

      {user && (
        <View>
          <Text>Welcome {user.displayName}</Text>
          <Button
            onPress={this.signOut}
            title="LogOut"
            color="red"></Button>
        </View>
      )}

    </View>
  )
}
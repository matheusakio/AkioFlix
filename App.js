import React from 'react'
import { useState, useEffect } from 'react'
import { StatusBar, View, Text, FlatList, Image, StyleSheet, ImageBackground, Linking} from 'react-native'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ScrollView } from 'react-native-gesture-handler'
import axios from 'axios'


const Stack = createStackNavigator()

function App() {
  return (
    <>
      <StatusBar barStyle="light-content"></StatusBar>
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Akioflix" component={HomeScreen} />
          <Stack.Screen
            options={({ route }) => ({ title: route.params.movie.title })}
            name="Detail"
            component={DetailScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

//HomeScreen

const HomeScreen = ({ navigation }) => {
  const url = 'https://yts.mx/api/v2/list_movies.json'
  const [movies, setMovies] = useState([])

  useEffect(() => {
    getData()
  }, [])

  const callDetail = (item) => {
    navigation.navigate('Detail', { movie: item })
  }

  const getData = async () => {
    try {
      const response = await axios.get(url)
      const content = response.data;
      const { movies: data } = content.data
      setMovies(data)
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        keyExtractor={(item) => String(item.id)}
        data={movies}
        renderItem={({ item, index }) => <RowMovies onPress={() => callDetail(item)} item={item} />}
      ></FlatList>
    </View>
  )
}

//RowMovies

const RowMovies = ({ item, onPress }) => {
  const getStars = () => {
    let stars = '';
    return stars.padStart(item.rating, '★')
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.principal}>
      <Image style={styles.cover} source={{ uri: item.medium_cover_image }} />
      <View style={styles.side}>
        <Text style={styles.titulo}>{item.title}</Text>
        <Text style={styles.ano}>{`Ano: ${item.year}`}</Text>
        <Text
          style={{ ...styles.rating, color: item.rating > 6 ? 'yellow' : 'red' }}
        >{`Nota: ${item.rating}`}</Text>
        <Text style={styles.rating}>{getStars()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const DetailScreen = ({ navigation, route }) => {
  const movie = route.params.movie
  const youtube_url = `https://www.youtube.com/watch?v=${movie.yt_trailer_code}`

  const getStars = () => {
    let stars = '';
    return stars.padStart(movie.rating, '★')
  }

  const callYoutube = () => {
    Linking.openURL(youtube_url)
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        imageStyle={{ opacity: 0.4 }}
        style={styles.banner}
        source={{ uri: movie.background_image }}
      >
        <Image style={styles.cover2} source={{ uri: movie.medium_cover_image }} />
        <View>
          <Text style={styles.title}>{movie.title_long}</Text>
        </View>
      </ImageBackground>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.year}>{`Ano: ${movie.year}`}</Text>
          <Text
            style={{ ...styles.rating, color: movie.rating > 6 ? 'yellow' : 'red' }}
          >{`Nota: ${movie.rating}`}</Text>
          <Text style={styles.rating}>{getStars()}</Text>

          <TouchableOpacity onPress={callYoutube}>
            <Text style={styles.youtube}>Assistir no Youtube</Text>
          </TouchableOpacity>

          <Text style={styles.subtitle}>Descrição</Text>
          <Text style={styles.description}>{movie.description_full}</Text>
          <Text style={styles.subtitle}>Generos</Text>
          {movie.genres.map((genre) => (
            <Text style={styles.description}>{` - ${genre}`}</Text>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  principal: {
      flexDirection: 'row',
      marginVertical: 8,
  },
  cover: {
      width: 100, 
      height: 130,
      marginLeft: 16,

  },
  side: {
    height: 100,
    marginLeft: 16,


  },
  titulo: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ano: {
    marginTop: 8,
    color: '#ccc',
    fontSize: 14,
  },
  nota: {
    marginTop: 8,
    color: 'yellow',
    fontSize: 12,
  },
  subtitle: {
    marginTop: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  youtube: {
    marginTop: 18,
    color: 'orange',
    fontWeight: 'bold',
  },
  content: {
    padding: 32,
  },
  description: {
    marginTop: 8,
    color: 'white',
    fontSize: 14,
  },
  banner: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  cover2: {
    marginLeft: 16,
    marginRight: 16,
    width: 100,
    height: 130,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  year: {
    marginTop: 8,
    color: '#ccc',
    fontSize: 14,
  },
  rating: {
    marginTop: 8,
    color: 'yellow',
    fontSize: 12,
  },
})


export default App
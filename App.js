import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Linking,
  StyleSheet,
  Image,
  ImageBackground,
  BackHandler,
  Animated,
} from "react-native";
import { Button, Icon } from "react-native-elements";

const image = { uri: "./assets/menuImages/background.jpg" };

const FoodSelectionScreen = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderMessage, setOrderMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]); 

  const foodItems = [
    {
      id: 1,
      name: "Pizza",
      price: 10,
      additions: [
        { id: 1, name: "Extra cheese", price: 2 },
        // ... other additions
      ],
      image: require("./assets/menuImages/pizza.jpg"),
    },
    // ... other food items
  ];


  const handleAddItem = (item, addition) => {
    const updatedItem = { ...item, price: item.price + addition.price };
    const updatedItems = [...selectedItems, updatedItem];
    setSelectedItems(updatedItems);
    setTotalPrice(totalPrice + updatedItem.price);
  };

  const handleResetTotalPrice = () => {
    setTotalPrice(0);
    setSelectedItems([]);
  };

  const handleSendOrder = () => {
    let message = `¡Hola! Me gustaría ordenar los siguientes items: \n`;

    selectedItems.forEach((item) => {
      message += `${item.name} - $${item.price}\n`;
    });

    message += `\nTotal: $${totalPrice}`;
    setOrderMessage(message);

    const phoneNumber = "3115776456";
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      orderMessage
    )}`;

    Linking.openURL(whatsappLink).catch((err) =>
      console.error("Error al abrir WhatsApp:", err)
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <Text style={styles.header}>Elige algo del menú: </Text>
        <FlatList
          data={foodItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.foodItem}>
              <Image source={item.image} style={styles.foodImage} />
              <Text>
                {item.name} - $ {item.price}
              </Text>
              <FlatList
                data={item.additions}
                keyExtractor={(addition) => addition.id.toString()}
                renderItem={({ addition }) => (
                  <Button 
                    title={`Añadir ${addition.name} - $${addition.price}`}
                    onPress={() => handleAddItem(item, addition)}
                  />
                )}
              />
              <Animated.View
              style={{ opacity: fadeAnim }}
              >
              <Button 
                icon={
                  <Icon
                    name="add"
                    size={15}
                    color="white"
                  />
                }
                title="Añadir"
                onPress={() => handleAddItem(item)}
              />
              </Animated.View>
            </View>
          )}
        />
        <Text style={styles.totalPrice}>Precio total: ${totalPrice}</Text>
        <Button 
          icon={
            <Icon
              name="refresh"
              size={15}
              color="white"
            />
          }
          title="  Reiniciar Precio Total"
          onPress={handleResetTotalPrice} style={{margin: 10}}
        />
        <Button 
          icon={
            <Icon
              name="send"
              size={15}
              color="white"
            />
          }
          title="Enviar pedido vía WhatsApp" style={{margin: '20px'}}
          onPress={handleSendOrder}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    fontFamily: 'System',
  },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  foodImage: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
});

export default FoodSelectionScreen;
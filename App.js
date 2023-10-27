import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Image, Modal, Button, Linking, TextInput } from 'react-native'; 
// import Sound from 'react-native-sound'; // al importar esta librería 

// images
import Logo from './assets/menuImages/cucina82logo.png'
import { FlatList } from 'react-native-web';

// Carga los archivos de sonido
// const soundClick = new Sound(require('./assets/sounds/ding.mp3'), Sound.MAIN_BUNDLE);

export default function App() {
  const [order, setOrder] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAdditions, setSelectedAdditions] = useState([]);
  const [additionsModalVisible, setAdditionsModalVisible] = useState(false);
  // const [backgroundSound, setBackgroundSound] = useState(null);
  const [drinkModalVisible, setDrinkModalVisible] = useState(false);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [drinkPrice, setDrinkPrice] = useState(0);
  // Modal para recibir datos
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [storedName, setStoredName] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const saveName = () => {
    setStoredName(name);
    toggleModal();
  };


    // Carga el sonido de fondo en useEffect
    // useEffect(() => {
    //   const sound = new Sound('./sounds/background.wav', Sound.MAIN_BUNDLE, (error) => {
    //     if (error) {
    //       console.error('Error al cargar el sonido de fondo', error);
    //       return;
    //     }
    //     // Reproduce el sonido de fondo en bucle
    //     sound.setNumberOfLoops(-1);
    //     sound.play();
    //     setBackgroundSound(sound);
    //   });
  
    //   // Detén el sonido de fondo cuando el componente se desmonte
    //   return () => {
    //     if (backgroundSound) {
    //       backgroundSound.stop();
    //       backgroundSound.release();
    //     }
    //   };
    // }, []);

    useEffect(() => {
      if (drinkModalVisible) {
        // Abre el modal de bebidas automáticamente cuando es visible
        const drinksTotalPrice = selectedDrinks.reduce((total, drink) => total + drink.price, 0);
        if (drinksTotalPrice === 0) {
          sendOrderToWhatsApp();
        }
      }
    }, [drinkModalVisible, selectedDrinks]);

  const menuItems = [
    { id: 1, name: 'Hamburguesa', price: 10, image: require('./assets/menuImages/burger.jpg') },
    {
      id: 2, name: 'Classic Burger 120gr', price: 18000, image: require('./assets/menuImages/burgerClassic.png')
    },
    {
      id: 3, name: 'Special Burger 160gr', price: 23000, image: require('./assets/menuImages/specialBurger.jpg')
    },
    {
      id: 4, name: 'Classic Burger 82 - 2x1', price: 30000, image: require('./assets/menuImages/Burger2x1.jpg')
    },
    { id: 5, name: 'Hawaiana with chicken and bacon - Personal', price: 15000, image: require('./assets/menuImages/hawaianaPizzaRanchera.png') },
    { id: 6, name: 'Hawaiana with chicken and bacon - 2 persons', price: 35000, image: require('./assets/menuImages/hawaianaPizzaRanchera2.png') },
    { id: 7, name: 'Hawaiana with chicken and bacon - Median', price: 52000, image: require('./assets/menuImages/hawaianaPizzaRanchera3.jpg') },
    { id: 8, name: 'Ranchera Pizza personal', price: 15000, image: require('./assets/menuImages/rancheraPizza.jpg') },
    { id: 9, name: 'Ranchera Pizza - 2 persons', price: 35000, image: require('./assets/menuImages/pizza.jpg') },
    { id: 10, name: 'Ranchera Pizza median', price: 52000, image: require('./assets/menuImages/pizza.jpg') },
    { id: 11, name: 'Vegetarian pizza - personal', price: 15000, image: require('./assets/menuImages/pizza.jpg') },
    { id: 12, name: 'Vegetarian pizza - 2 persons', price: 35000, image: require('./assets/menuImages/pizza.jpg') },
    { id: 13, name: 'Vegetarian pizza median', price: 52000, image: require('./assets/menuImages/pizza.jpg') },
    { id: 14, name: 'Ensalada', price: 8, image: require('./assets/menuImages/salad.jpg') },
  ];

  const additionsOptions = [
    { id: 1, name: 'aceitunas', price: 4000 },
    { id: 2, name: 'Huevo', price: 4000 },
    { id: 3, name: 'Queso', price: 4000 },
    {id: 4, name: 'Tocineta', price: 4000 },
    { id: 5, name: 'Papa', price: 4000 },
    {id: 6, name: 'Piña', price: 4000 } 
  ];

  const drinkOptions = [
    { id: 1, name: 'Jugo hit frasco', price: 3500 },
    { id: 2, name: 'Jugo hit caja', price: 4500 },
    { id: 3, name: 'Coca-cola', price: 2000 },
    // Agrega más opciones de bebidas según sea necesario
  ];

  const addToOrder = (item) => {
    setSelectedItem(item);
    setAdditionsModalVisible(true);
    // soundClick.play(); // reproduce un sonido de click
  };

  const addAddition = (addition) => {
    setSelectedAdditions([...selectedAdditions, addition]);
  };

  const removeAddition = (addition) => {
    const newAdditions = selectedAdditions.filter((item) => item.id !== addition.id);
    setSelectedAdditions(newAdditions);
  };

  const closeAdditionsModal = () => {
    setAdditionsModalVisible(false);
  };

  const confirmOrder = () => {
    // Calcula el precio total de las adiciones seleccionadas
    const additionsPrice = selectedAdditions.reduce((total, addition) => total + addition.price, 0);

    const itemWithAdditions = {
      ...selectedItem,
      additions: selectedAdditions,
    };

    const newOrder = [...order, itemWithAdditions];
    const newTotalPrice = totalPrice + itemWithAdditions.price + additionsPrice;
    setOrder(newOrder);
    setTotalPrice(newTotalPrice);

    setSelectedAdditions([]);
    setAdditionsModalVisible(false);
  };

  const clearOrder = () => {
    setOrder([]);
    setTotalPrice(0);
  };

  const sendOrderToWhatsApp = () => {
    // Mostrar el modal de bebidas antes de enviar el pedido por WhatsApp
    setDrinkModalVisible(true);
  };

  const closeDrinkModal = () => {
    setDrinkModalVisible(false);
    // Después de cerrar el modal de bebidas, puedes proceder a enviar el pedido por WhatsApp
    sendWhatsAppOrder();
  };

  const sendWhatsAppOrder = () => {
    // Calcula el precio total de las bebidas seleccionadas
    const drinksTotalPrice = selectedDrinks.reduce((total, drink) => total + drink.price, 0);

    // Calcula el precio total del pedido sumando el precio de la comida y las bebidas
    const totalOrderPrice = totalPrice + drinksTotalPrice;

    const orderText = order
      .map((item) => {
        let itemText = `${item.name} - $${item.price}`;
        if (item.additions.length > 0) {
          const additionsText = item.additions.map((addition) => `${addition.name} +$${addition.price}`).join(', ');
          itemText += ` (Adiciones: ${additionsText})`;
        }
        return itemText;
      })
      .join('%0A');

    const drinksText = selectedDrinks.map((drink) => ` ${drink.name} +$${drink.price}`).join('%0A');

    const message = `Mi pedido:%0A${orderText}%0ATotal de Comida: $${totalPrice}%0ABebidas:${drinksText}%0ATotal de Bebidas: $${drinksTotalPrice}%0ATotal por todo: $${totalOrderPrice}`;
    const phoneNumber = ''; // number here

    const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${message}`;

    Linking.openURL(whatsappURL)
      .then((data) => {
        console.log('WhatsApp abierto exitosamente:', data);
      })
      .catch((error) => {
        console.error('Error al abrir WhatsApp:', error);
      });
  };

  const addDrink = (drink) => {
    setSelectedDrinks([...selectedDrinks, drink]);
    setDrinkPrice(drinkPrice + drink.price);

    // Actualiza el precio total del pedido sumando el precio de la bebida
    setTotalPrice(totalPrice + drink.price);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Menú del restaurante de
      <Image source={Logo} style={styles.logo} transition={1000} placeholder={'Logo de la cocina :)'} />
      </Text>
      
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => addToOrder(item)}
          >
            <Image source={item.image} style={styles.menuItemImage} />
          <View>
            <Text>{item.name}</Text>
            </View>
          <View> 
            <Text>${item.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.header}>Pedido Actual:</Text>
      <ScrollView style={styles.orderContainer}>
        {order.map((item, index) => (
          <Text key={index} style={styles.orderItem}>
            {item.name} - ${item.price} {item.additions.length > 0 ? `(+${item.additions.length} Adiciones)` : ''}
          </Text>
        ))}
        <Text style={styles.total}>Total: ${totalPrice}</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearOrder}>
          <Text style={styles.buttonText}>Reiniciar Pedido</Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity style={styles.sendButton} onPress={sendOrderToWhatsApp}>
        <Text style={styles.buttonText}>Enviar Pedido por WhatsApp</Text>
      </TouchableOpacity>

      {/* Modal para Adiciones */}
      <Modal visible={additionsModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Selecciona Adiciones para {selectedItem?.name}</Text>
          {additionsOptions.map((addition) => (
            <View key={addition.id} style={styles.additionItem}>
              <Text style={styles.drinkTextModal}>{addition.name} (+${addition.price})</Text>
              {selectedAdditions.includes(addition) ? (
                <TouchableOpacity
                  style={styles.removeAdditionButton}
                  onPress={() => removeAddition(addition)}
                >
                  <Text style={styles.buttonText}>Quitar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.addAdditionButton}
                  onPress={() => addAddition(addition)}
                >
                  <Text style={styles.buttonText}>Agregar</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <View style={{marginTop: 15}}>
          <Button title="Confirmar" onPress={confirmOrder} />
          </View>
          <View style={{marginTop: 15}}>
          <Button title="Cerrar" onPress={closeAdditionsModal} />
          </View>
        </View>
      </Modal>

      {/* Modal para Bebidas */}
      <Modal visible={drinkModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Espera, no olvides tu bebida!</Text>
          {drinkOptions.map((drink) => (
            <View key={drink.id} style={styles.additionItem}>
              <Text style={styles.drinkTextModal}>{drink.name} (+${drink.price})</Text>
              {selectedDrinks.includes(drink) ? (
                <TouchableOpacity
                  style={styles.removeAdditionButton}
                  onPress={() => removeDrink(drink)}
                >
                  <Text style={styles.buttonText}>Quitar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.addAdditionButton}
                  onPress={() => addDrink(drink)}
                >
                  <Text style={styles.buttonText}>Agregar</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <Button title="Confirmar pedido" onPress={closeDrinkModal} />
        </View>
      </Modal>
                {/* Modal para bienvenida */}
     {/* <Modal>
      <View style={styles.viewInput}>
      <Text style={styles.textInput}>Hola, bienvenido al menú del restaurante de Hostel82, antes de comenzar, necesitamos que nos digas tu nombre </Text>
              <TextInput placeholder={'Inserta tu nombre :3'} style={styles.input} >
              </TextInput>
              <Button title='Aceptar' color='#0479B8'/>
      </View>
     </Modal>
     <Modal isVisible={isModalVisible}>
        <View style={{  }}>
          <Text>Ingresa tu nombre:</Text>
          <TextInput
            placeholder="Nombre"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Button title="Guardar" onPress={saveName} />
          <Button title="Cancelar" onPress={toggleModal} />
        </View>
      </Modal>  */}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    paddingBottom: 10
  },
  menuContainer: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuItemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  orderContainer: {
    marginBottom: 20,
    paddingBottom: 70,
    
  },
  orderItem: {
    fontSize: 16,
    marginBottom: 5
  },
  total: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 10,
  },
  clearButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  sendButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  // Modal para Adiciones
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  additionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addAdditionButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
  },
  removeAdditionButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  // modal para bebidas
  drinkTextModal: {
    backgroundColor: '#202020',
    color: '#fff',
    padding: 5,
    borderRadius: 10,
    marginRight: 20,
  },
  // modal para input
  viewInput: {
    alignItems: 'center',
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#202020',
    fontSize: 30,
    marginTop: 20,
    padding: 30,
  },
  input: {
    width: 250,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#e8e8e8',
  },
});
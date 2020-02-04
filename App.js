import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { TextInput, Button, shadow } from 'react-native-paper';

export default class Main extends Component {

  state = {
    ArrayObject: [],
    textInput: '',
  }
  componentDidMount = () => {
    AsyncStorage.getItem('@ArrayObject', (err, result) => {
      this.setState({
        ArrayObject: JSON.parse(result)
      })
    });

  }
  _storageSave = () => {
    var arrayObjectAux = this.state.ArrayObject || []
    arrayObjectAux.push(this.state.textInput)

    this.setState({ ArrayObject: arrayObjectAux })

    AsyncStorage.setItem('@ArrayObject', JSON.stringify(this.state.ArrayObject));
    this.setState({textInput : ''})
  }

  _removeItemStorage = (pos) => {
    var arrayObjectAux = this.state.ArrayObject || []
    arrayObjectAux.splice(pos,1)
    this.setState({ ArrayObject: arrayObjectAux })
    AsyncStorage.setItem('@ArrayObject', JSON.stringify(this.state.ArrayObject));
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#222222'}}>
      
          <TextInput
            style={{backgroundColor: '#222222',marginTop : 52,marginBottom : 2, marginLeft : 12, marginRight : 12}}
            label='OlokinhioMew'
            mode = 'outlined'
            value={this.state.textInput}
            onChangeText={value => this.setState({ textInput: value })}
            onEndEditing={this._storageSave}
          />
          <ScrollView>
              {
                (this.state.ArrayObject) ?
                  this.state.ArrayObject.map((value, index) =>
                    <View key={index} style={styles.box}>
                      <Text style={{textAlign: 'center', color: 'white'}} key={index}>{value}</Text>
                      <Button style={{}} onPress={()=> this._removeItemStorage(index)}>Remove</Button> 
                    </View>
                  )
                  :
                  null
              }
           
          </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box : {
    borderRadius : 10, 
    borderWidth : 2,
    flex : 1,
    marginTop: 14,
    marginLeft: 14,
    marginRight: 14,
    borderColor: '#6c29d6'
  }
})
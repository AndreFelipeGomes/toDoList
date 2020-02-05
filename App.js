import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';

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
    var textObjct = {
      text: this.state.textInput,
      check: false,
    }
    arrayObjectAux.push(textObjct)

    this.setState({ ArrayObject: arrayObjectAux })

    AsyncStorage.setItem('@ArrayObject', JSON.stringify(this.state.ArrayObject));
    this.setState({ textInput: '' })
  }

  _removeItemStorage = (pos) => {
    var arrayObjectAux = this.state.ArrayObject || []
    arrayObjectAux.splice(pos, 1)
    this.setState({ ArrayObject: arrayObjectAux })
    AsyncStorage.setItem('@ArrayObject', JSON.stringify(this.state.ArrayObject));
  }

  _checkItemStorage = (pos) => {
    var arrayObjectAux = this.state.ArrayObject || []
    arrayObjectAux[pos].check = true
    AsyncStorage.setItem('@ArrayObject', JSON.stringify(arrayObjectAux))
    this.setState({
      ArrayObject : arrayObjectAux
    })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#222222' }}>
        <TextInput
          style={styles.textInput}
          label='Descrição'
          mode='outlined'
          value={this.state.textInput}
          onChangeText={value => this.setState({ textInput: value })}
          onEndEditing={this._storageSave}
        />
        <ScrollView>
          {
            (this.state.ArrayObject) ?
              this.state.ArrayObject.map((value, index) =>
                <View key={index} style={styles.box}> 
                  <Text style={{ textAlign: 'center', color: 'white' }} key={index}>{value.text}</Text>
                  {
                    (!value.check) ?
                      <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', }}>
                        <Button icon='minus' color='red' onPress={() => this._removeItemStorage(index)}></Button>
                        <Button icon='check' color='green' onPress={() => this._checkItemStorage(index)}></Button>
                      </View>
                      :
                      null
                  }
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
  box: {
    borderRadius: 10,
    borderWidth: 2,
    flex: 1,
    marginTop: 14,
    marginLeft: 14,
    marginRight: 14,
    borderColor: 'orange'
  },
  textInput: {
    backgroundColor: '#222222',
    marginTop: 52,
    marginBottom: 2,
    marginLeft: 12,
    marginRight: 12,
  },
})
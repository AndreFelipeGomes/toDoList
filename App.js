import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { TextInput, Button, DefaultTheme, Provider as PaperProvider, Appbar } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default class Main extends Component {

  state = {
    ArrayObject: [],
    textInput: '',
    date: '',
    isDatePickerVisible: false,
  }
  componentDidMount = () => {
    var today = new Date();
    today = today.toISOString()
    var ano = today.substr(0,4)
    var mes = today.substr(5,2)
    var dia = today.substr(8,2)
    AsyncStorage.getItem('@ArrayObject', (err, result) => {
      this.setState({
        ArrayObject: JSON.parse(result),
        date: dia + '/' + mes + '/' + ano
      })
    });
  }
  _storageSave = () => {

    //Usa uma variavel auxiliar para nao dar conflito com a renderizacao da tela e n chamar o evento em loop
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    var arrayObjectAux = this.state.ArrayObject || []
    var textObjct = {
      text : this.state.textInput,
      check: false,
      date : this.state.date,
    }

    //Coloca o objeto dento do array
    ////////////////////////////////
    arrayObjectAux.push(textObjct)

    //Altera o array do state para renderizar o novo arry em tela
    /////////////////////////////////////////////////////////////
    this.setState({ ArrayObject: arrayObjectAux })

    //Salva o novo array no localStorage
    ////////////////////////////////////
    AsyncStorage.setItem('@ArrayObject', JSON.stringify(this.state.ArrayObject));

    //Limpa o a descricao do textInput
    //////////////////////////////////
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
      ArrayObject: arrayObjectAux
    })
  }

  _limparArrayStorage = () => {
    var arrayObjectAux = []
    AsyncStorage.setItem('@ArrayObject', JSON.stringify(arrayObjectAux))
    this.setState({
      ArrayObject: arrayObjectAux
    })
  }

  render() {
    const showDatePicker = () => {
      this.setState({isDatePickerVisible: true});
    };
    const hideDatePicker = () => {
      this.setState({isDatePickerVisible: false});
    };
    const handleConfirm = date => {
      var today = JSON.stringify(date);
      var ano = today.substr(1,4)
      var mes = today.substr(6,2)
      var dia = today.substr(9,2)
      hideDatePicker();
      this.setState({date: dia + '/' + mes + '/' + ano});
    };
    return (
      <PaperProvider theme={theme}>
        <View style={{ flex: 1, backgroundColor: '#222222', }}>
          <Appbar.Header>
            <Appbar.Content
              title="To do list"
              subtitle={this.state.date}
            />
            <Appbar.Action icon="calendar" onPress={showDatePicker} />
          </Appbar.Header>
          <DateTimePickerModal
            isVisible={this.state.isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            isDarkModeEnabled={true}
          />
          <View style={{ paddingTop: 25 }}>
            <TextInput
              style={styles.textInput}
              label='Descrição'
              mode='outlined'
              value={this.state.textInput}
              onChangeText={value => this.setState({ textInput: value })}
            />
            <Button color='green' onPress={() => this._storageSave()}>Adicionar</Button>
          </View>
          <ScrollView>
            {
              (this.state.ArrayObject) ?
                this.state.ArrayObject.map((value, index) =>
                (value.date == this.state.date)? //Filtra a data
                    <View key={index} style={(!value.check) ? styles.box : styles.boxCheck}>
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
                  :
                   null
                )
                :
                null
            }
          </ScrollView>
          <Button color='red' onPress={() => this._limparArrayStorage()}>Limpar</Button>
        </View>
      </PaperProvider>
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
  boxCheck: {
    borderRadius: 10,
    borderWidth: 2,
    flex: 1,
    marginTop: 14,
    marginLeft: 14,
    marginRight: 14,
    borderColor: 'green'
  },
  textInput: {
    backgroundColor: '#222222',
    marginLeft: 12,
    marginRight: 12,
  },
})

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    primary: 'orange',
    accent: '#f1c40f',
  },
};

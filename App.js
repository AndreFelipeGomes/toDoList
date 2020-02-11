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
    dateAux: null
  }

  componentDidMount = () => {
    var today = new Date();
    today = today.toISOString()
    var ano = today.substr(0, 4)
    var mes = today.substr(5, 2)
    var dia = today.substr(8, 2)
    var dateAux = new Date(ano, mes - 1, dia);
    AsyncStorage.getItem('@ArrayObject', (err, result) => {
      this.setState({
        ArrayObject: JSON.parse(result),
        date: dia + '/' + mes + '/' + ano,
        dateAux: dateAux
      })
    });
  }

  _storageSave = () => {
    //Usa uma variavel auxiliar para nao dar conflito com a renderizacao da tela e n chamar o evento em loop
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    var arrayObjectAux = this.state.ArrayObject || []
    var textObjct = {
      text: this.state.textInput,
      check: false,
      date: this.state.date,
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
      this.setState({ isDatePickerVisible: true });
    };

    const hideDatePicker = () => {
      this.setState({ isDatePickerVisible: false });
    };

    const handleConfirm = date => {

      var today = JSON.stringify(date);

      var ano = today.substr(1, 4)
      var mes = today.substr(6, 2)
      var dia = today.substr(9, 2)

      hideDatePicker();

      var dateAux = new Date(ano, mes - 1, dia);
      this.setState({ date: dia + '/' + mes + '/' + ano, dateAux: dateAux });
    };

    //FILTRA ARRAY PARA REMOVER TODOS OS ITEM PELA DATA SELECIONADA NO CALENDARIO
    /////////////////////////////////////////////////////////////////////////////
    _filterArray = () => {
      var dataAtual = this.state.date
      var filtered = this.state.ArrayObject.filter(function(value){
        if (value.date != dataAtual) {
          return value
        }
      }) 
      this.setState({
        ArrayObject : filtered    
      })     
      //Salva o novo array no localStorage
      ////////////////////////////////////
      AsyncStorage.setItem('@ArrayObject', JSON.stringify(this.state.ArrayObject));
    }

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
            date={this.state.dateAux}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <View style={{ paddingTop: 25 }}>
            <TextInput
              style={styles.textInput}
              label='Descrição'
              mode='outlined'
              color='white'
              value={this.state.textInput}
              onChangeText={value => this.setState({ textInput: value })}
            />
            <Button color='white' style={{backgroundColor: '#5AD170', marginTop: 12, marginLeft: 12, marginRight: 12}} onPress={() => this._storageSave()}>Adicionar</Button>
          </View>
          <ScrollView>
            {
              (this.state.ArrayObject) ?
                this.state.ArrayObject.map((value, index) =>
                  (value.date == this.state.date) ? //Filtra a data
                    <View key={index} style={(!value.check) ? styles.box : styles.boxCheck}>
                      <Text style={{ textAlign: 'center', color: 'white' }} key={index}>{value.text}</Text>
                          <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', }}>
                            <Button icon='minus' color='white' style={{flex: (!value.check)? 0.5 : 1,backgroundColor: '#D15A5A', borderBottomLeftRadius: 10, borderBottomRightRadius: (!value.check)? 0 : 10}} onPress={() => this._removeItemStorage(index)}></Button>
                            {
                              (!value.check)? 
                                <Button icon='check' color='white' style={{flex: 0.5,backgroundColor: '#5AD170',  borderBottomRightRadius: 10}} onPress={() => this._checkItemStorage(index)}></Button>
                              :
                                null
                            }                         
                          </View>
                    </View>
                    :
                    null
                )
                :
                null
            }
          </ScrollView>
          <Button color='white' style={{backgroundColor: '#D15A5A'}} onPress={() => _filterArray()}>Limpar</Button>
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
    borderColor: '#D37E5A'
  },
  boxCheck: {
    borderRadius: 10,
    borderWidth: 2,
    flex: 1,
    marginTop: 14,
    marginLeft: 14,
    marginRight: 14,
    borderColor: '#5AD170'
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
    primary: '#D37E5A',
    accent: '#f1c40f',
  },
};

import React, { useState, useEffect } from 'react';
import { Feather as Icon} from '@expo/vector-icons';
import { View, ImageBackground, Image, Text, TextInput, Picker } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

import logoImg from '../../assets/logo.png';
import backImg from '../../assets/home-background.png';

import styles from './styles';

interface IBGEUFResponse{
    sigla: string
}

interface IBGECityResponse{
    nome: string
}

function Home(){
    const navigation = useNavigation();

    const [ IBGEUfs, setIBGEUfs ] = useState<String[]>([]);
    const [ IBGECities, setIBGECities ] = useState<String[]>([]);

    const [ selectedUf, setSelectedUf ] = useState("");
    const [ selectedCity, setSelectedCity ] = useState("");

    function handleNavigateToPoints(){
        navigation.navigate('Points', {
            selectedUf,
            selectedCity
        });
    }

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            setIBGEUfs(ufInitials);
        })
    },[]);

    useEffect(() => {
        if(selectedUf === "0"){
            return;
        }

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);

                setIBGECities(cityNames);
            })
    },[selectedUf]);

    return(
        <ImageBackground 
            source={backImg} 
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
               
                <Image source={logoImg}/>
                
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                
            </View>

            <View style={styles.footer}>
                <Picker
                    
                    selectedValue={selectedUf}
                    style={styles.select}
                    onValueChange={(itemValue, itemIndex) => setSelectedUf(itemValue)}
                >
                    <Picker.Item label="Selecione uma UF" value="0"/>
                    {IBGEUfs.map(uf => (
                        <Picker.Item label={String(uf)} key={String(uf)} value={String(uf)}/>
                            
                    ))}
                </Picker>

                <Picker
                    
                    selectedValue={selectedCity}
                    style={styles.select}
                    onValueChange={(itemValue, itemIndex) => setSelectedCity(itemValue)}
                >
                    <Picker.Item label="Selecione uma Cidade" value="0"/>
                    {IBGECities.map(city => (
                        <Picker.Item label={String(city)} key={String(city)} value={String(city)}/>
                            
                    ))}
                </Picker>        

                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#fff" size={24}/>
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
    </ImageBackground>       
    );
}

export default Home;
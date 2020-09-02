import React, { useState, useEffect } from 'react';

import { View, Text, Image, SafeAreaView, Linking } from 'react-native';
import { TouchableOpacity, RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

import styles from './styles';

interface Params {
    point_id: number;
}

interface Data{
    serializedPoint: {
        image: string,
        image_url: string,
        name: string,
        email: string,
        whatsapp: string,
        city: string,
        uf: string,
    }
    items: {
        title: string,
    }[];
}

function Detail(){
    const [ data, setData] = useState<Data>({} as Data);

    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params; 

    function handleNavigateBack(){
        navigation.goBack();
    }

    function handleComposeMail(){
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de resíduos',
            recipients: [data.serializedPoint.email]
        });
       
    }

    function handleWhatsapp(){
        Linking.openURL(`whatsapp://send?phone=${data.serializedPoint.whatsapp}&text=Tenho interesse sobre coleta de resídous`)
    }

    useEffect(() => {
        api.get(`points/${routeParams.point_id}`).then(response => {
            setData(response.data);
        });
    }, []);

    if(!data.serializedPoint){
        
        return null;
    }

    return (
        <SafeAreaView style={{ flex: 1}}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                        <Icon name="arrow-left" size={20} color="#34cb79"/> 
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: data.serializedPoint.image_url }}/>
                
                <Text style={styles.pointName}>{data.serializedPoint.name}</Text>
                <Text style={styles.pointItems}>
                    {data.items.map(item => item.title).join(', ')}
                </Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{data.serializedPoint.city}, {data.serializedPoint.uf}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp"size={20} color="#fff"/>
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>

                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name="mail"size={20} color="#fff"/>
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>
            </View>
        </SafeAreaView>
        
    );
}

export default Detail;
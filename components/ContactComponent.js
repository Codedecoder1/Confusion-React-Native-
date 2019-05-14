import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Card, Text} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';


function RenderContact(props) {

        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>                
            <Card
                title='Contact Information'>

            
                    <Text
                    style={{margin: 10}}>121, Clear Water Bay Road {"\n"} </Text> 
                    <Text
                    style={{margin: 10}}>Clear Water Bay, Kowloon {"\n"}</Text> 
                    <Text
                    style={{margin: 10}}>HONG KONG {"\n"}</Text>
                    <Text
                    style={{margin: 10}}>Tel: +852 1234 5678 {"\n"}</Text> 
                    <Text
                    style={{margin: 10}}>Fax: +852 8765 4321 {"\n"}</Text>
                    <Text
                    style={{margin: 10}}> Email:confusion@food.net {"\n"} </Text>
                   </Card>
                </Animatable.View>
        );
    }




class ContactUs extends Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        title: 'Contact Us'
    };

    render() {
        return(
            <ScrollView>
                <RenderContact />
            </ScrollView>
        );
    }
}

export default ContactUs;
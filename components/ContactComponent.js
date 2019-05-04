import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Card, Text} from 'react-native-elements';

function RenderContact(props) {

        return(
            <Card
                title="Contact Information">

                <Text h6
                    style={{margin: 10}}> 
                    121, Clear Water Bay Road {"\n"}
                    Clear Water Bay, Kowloon {"\n"}
                    HONG KONG {"\n"}
                    Tel: +852 1234 5678 {"\n"}
                    Fax: +852 8765 4321 {"\n"}
                    Email:confusion@food.net {"\n"}
                   </Text>
            </Card>
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
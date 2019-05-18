import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder } from 'react-native';
import { Card, Icon, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import { Rating} from 'react-native-ratings';
import * as Animatable from 'react-native-animatable';



const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites,
        comment: state.comment
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (comment) => dispatch(postComment(comment))
});


function RenderDish(props) {
    const dish = props.dish;

    handleViewRef = ref => this.view = ref;

const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }

   const recognizeComment = ({moveX, moveY, dx, dy}) => {
    if ( dx > 200 )
    return true;
else
    return false;

   }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},

        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
                else if (recognizeComment(gestureState)){
                    props.toggleModal();

                }
            return true;
        }
    })

    if (dish != null) {
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
            ref={this.handleViewRef}
            {...panResponder.panHandlers}>
                <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}>
                <Text style={{ margin: 10 }}>
                    {dish.description}
                </Text>
                <Icon
                    raised
                    reverse
                    name={props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                />
                <Icon
                    raised
                    reverse
                    name={'pencil'}
                    type='font-awesome'
                    color='#0000FF'
                    onPress={() => props.toggleModal()}
                />

            </Card>
            </Animatable.View>


        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <View><Rating
                type="star"
               startingValue={+item.rating}
               fraction={0}
                imageSize={10}
                readonly/></View>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>

        );
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>        
            <Card title='Comments' >
                <FlatList 
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}


class DishDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            comments: [],
            showModal: false
        };
    }
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    handleComments = (dishId) => {
        const comment = {
            rating: this.state.rating,
            author: this.state.author,
            comment: this.state.comment,
            dishId: dishId
        }
        this.props.postComment(comment);
        this.toggleModal();

    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }


    resetForm() {
        this.setState({
            rating: 1,
            author: '',
            comment: '',
            showModal: false
        });
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    toggleModal={this.toggleModal}
                    
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.formRow}>
                        <Rating
                            showRating
                            imageSize={40}
                            ratingCount={5}
                            onFinishRating={(itemValue) => this.setState({rating: itemValue})}
                            style={{ paddingVertical: 10 }}
                            //defaultRating={this.state.rating}
                        />
                    </View>
                    <View style={styles.modal}>
                        <Input
                            placeholder="Author"
                            maxLength={20}  
                            inputStyle= {{marginLeft:10}}  
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            onChangeText={(itemValue) => this.setState({author: itemValue})} 
                            />
                    </View>
                    <View style={styles.formRow}>
                        <Input
                            placeholder="Comment"
                            maxLength={20}
                            inputStyle= {{marginLeft:10}}
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={(itemValue) => this.setState({comment: itemValue})} 
                        />
                    </View>
                    <View style={{margin:10}}>
                        <Button 
                            onPress={() => this.handleComments(dishId)}
                            title="SUBMIT"
                            color="#512DA8"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={{margin:10}}>
                        <Button 
                            onPress={() => { this.toggleModal(); this.resetForm(); }}
                            color="#512DA8"
                            title="Close"
                        />
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    formRow: {
        margin: 10
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
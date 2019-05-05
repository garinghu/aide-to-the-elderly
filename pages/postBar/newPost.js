import React from 'react';
import { ImagePicker, Camera, Permissions } from 'expo';
import { StyleSheet, Text, View, Image, DeviceEventEmitter, TouchableOpacity, TextInput, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Form, Item, Input, Label, Textarea, Button } from 'native-base';
import Axios from 'axios';

import { storage } from '../../storage';
import { debounce, randomNum, } from '../../common/setting';
import Config from '../../config';
import MyHeader from '../../common/MyHeader';

const ADD_NEW_POST = `${Config.proxy}/addnewpost`;
const POST_TYPES = Config.postTypes;
const BUTTON_COLORS = Config.buttonStyles;

export default class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            uri: '',
            userid: '',
            type: '',
            base64: '',
        };
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    componentDidMount() {
        DeviceEventEmitter.emit('changeShowMode', false);
        storage.load('userInfo', (data) => {
            this.setState({
                userid: data.userid,
            })
        })
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            base64: true,
            aspect: [4, 3],
        });
    
        if (!result.cancelled) {
            this.setState({ uri: result.uri, base64: result.base64 });
        }
    };

    changeTitle = e => {
        this.setState({ title: e })
    }

    changeContent = e => {
        this.setState({ content: e })
    }

    changeType = e => {
        this.setState({ type: e })
    }

    submitNewPost = () => {
        const { title, content, uri, userid, type, base64 } = this.state;
        const navigation = this.props.navigation;
        if(title && content && uri && type) {
            Axios.post(ADD_NEW_POST, { title, content, uri, userid, type, base64 })
            .then(res => {
                if(res.data == 'success') {
                    DeviceEventEmitter.emit('Key', '待传参数');
                    navigation.navigate('CardList');
                }
            })
            .catch(err => {
                console.log(err)
            })
        } else {
            Alert.alert('请完善信息')
        }
    }

    render() {
        const state = this.state;
        const { uri, type } = state;
        return (
            <Container>
                <MyHeader callBack={() => {
                    DeviceEventEmitter.emit('changeShowMode', true);
                }}/>
                <Content>
                    <TouchableOpacity onPress={this._pickImage}>
                        <View style={styles.imageContainer}>
                            {
                                uri ? <Image source={{ uri }} style={{height: 200, width: 200, flex: 1}} onPress={this._pickImage}/>
                                : <FontAwesome name='image' 
                                style={{ fontSize: 200, fontWeight: 'lighter', color: 'rgba(237, 101, 96, 0.5)' }}/>   
                            }
                            <Text style={{ color: '#aaa' }}>添加封面图</Text>
                        </View>
                    </TouchableOpacity>  
                    <Form>
                        <Item inlineLabel>
                            <Label>输入标题</Label>
                            <Input onChangeText={e => debounce(500)(this.changeTitle(e))}/>
                        </Item>  
                    </Form>
                    <Form>
                        <Textarea rowSpan={5} bordered placeholder="输入内容" style={{ marginLeft: 10 }}
                        onChangeText={e => debounce(500)(this.changeContent(e))}/>
                    </Form>
                    <Form>
                        <Item inlineLabel>
                            <Label>文章类别</Label>
                            <Input onChangeText={e => debounce(500)(this.changeType(e))} value={type}/>
                        </Item>  
                    </Form>
                    <View style={styles.typeContainer}>
                        {
                            POST_TYPES.map((item, index) => <Button rounded key={index} 
                            style={{ paddingLeft: 10, paddingRight: 10, margin: 10, backgroundColor: `${BUTTON_COLORS[randomNum(0, BUTTON_COLORS.length - 1)]}`}}
                            onPress={() => this.changeType(item)}>
                            <Text style={{ color: '#fff' }}>{item}</Text>
                          </Button>)
                        }
                    </View>
                    <Button full style={{ backgroundColor: 'rgba(237, 101, 96, 0.5)', marginTop: 20, }}
                    onPress = {() => this.submitNewPost()}>
                        <Text style={{ color: '#fff' }}>提交</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
    imageContainer: {
        flex: 1,
        alignItems:"center",
        backgroundColor: '#fafafa',
        color: '#eee',
        paddingBottom: 20,
    },
    typeContainer: {
        flex: 1,
        flexDirection: 'row',
    }
});

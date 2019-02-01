import React from 'react';
import { ImagePicker, Camera, Permissions } from 'expo';
import { StyleSheet, Modal, TouchableHighlight, View, Image, DeviceEventEmitter } from 'react-native';
import { withNavigation } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Left, Body, Right, Button, Content, Text, Thumbnail } from 'native-base';
import Axios from 'axios';

import { storage } from '../../storage';
import Config from '../../config';


const CHANGE_HEAD = `${Config.proxy}/changehead`;

class ChangeImgModal extends React.Component {
    
    constructor(props) {
        super(props);
        const { imgUri } = this.props;
        this.state = {
            uri: imgUri,
        }
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
    
        console.log(result);
    
        if (!result.cancelled) {
            this.setState({ uri: result.uri });
        }
    };

    changeHead = () => {
        const { uri } = this.state;
        const { imgUri, closeImgModal } = this.props;
        if(uri !== imgUri) {
            storage.load('userInfo', (data) => {
                Axios.post(CHANGE_HEAD, { head: uri, id: data.userid })
                .then(res => { 
                    console.log(res.data);
                    data.headImg = uri;
                    storage.save('userInfo', data);
                    DeviceEventEmitter.emit('refreshInfoListener');
                    DeviceEventEmitter.emit('refreshInfoData');
                    closeImgModal();
                })
            })
        }
    }

    render() {
        const { showImgModal, closeImgModal, imgUri } = this.props;
        const { uri } = this.state;
        return (
            <Modal
            animationType={"slide"}
            transparent={false}
            visible={showImgModal}
            onRequestClose={() => {alert("Modal has been closed.")}}
            >
                <Container style={styles.container}>
                    <Header style={{ backgroundColor: '#000'}}>
                        <Left>
                            <Button transparent onPress={() => {
                                this.setState({ uri: '' })
                                closeImgModal()
                            }}>
                                <Text style={{ color: '#fff', fontSize: 16 }}>取消</Text>
                            </Button>
                        </Left>
                        <Body>
                            <Text style={{ color: '#fff' }}>个人头像</Text>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => this.changeHead()}>
                                <Text style={{ color: '#fff', fontSize: 16 }}>完成</Text>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        <TouchableHighlight  onPress={this._pickImage}>
                            <Image source={{ uri: uri || imgUri }} style={{ height: 400, marginTop: 100 }}/>
                        </TouchableHighlight>
                    </Content>
                </Container>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       backgroundColor: '#000'
    },
});

export default withNavigation(ChangeImgModal);


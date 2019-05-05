import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity,DeviceEventEmitter, } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Input, Item, Footer, FooterTab } from 'native-base';
import Axios from 'axios';

import { storage } from '../../storage';
import { debounce, getDate, Base64 } from '../../common/setting';
import Config from '../../config';
import MyHeader from '../../common/MyHeader';

const ADD_COMMITS = `${Config.proxy}/addcommits`;
const ADD_SECOUND_COMMITS = `${Config.proxy}/addsecoundcommits`;
const user = {};
const b = new Base64();

export default class CardDetail extends React.Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const cardDetail = navigation.getParam('detail');
        const fromSearch = navigation.getParam('fromSearch');
        const {name, userName, time, headImg} = cardDetail;
        console.log(b.decode(cardDetail.content))
        const cardDetailContent = JSON.parse( b.decode(cardDetail.content));
        this.state = {
            cardDetailContent,
            cardId: cardDetail.id,
            commitContent: '',
            name,
            userName,
            time,
            headImg,
            fromSearch,
            isSecound: false,
            secoundIndex: null,
        }
    }

    componentDidMount() {
        DeviceEventEmitter.emit('changeShowMode', false);
        storage.load('userInfo', (data) => {
            user.userid = data.userid;
            user.username = data.username;
            user.headImg = data.headImg;
        })
    }

    addGoods = (index) => {
        this.state.cardDetailContent.commits[index].goods++;
        this.setState({});
    }

    addCommit = (id) => {
        const { commitContent, cardDetailContent, secoundIndex, isSecound } = this.state;
        const { userid, username, headImg } = user;
        if(!isSecound) {
            Axios.post(ADD_COMMITS, { cardId: id, commit: commitContent, userid, userName: username, headImg, })
            .then(res => {
                cardDetailContent.commits.unshift({
                    "name": `${username}`,
                    "content": `${commitContent}`,
                    "goods": 0,
                    "userid": `${userid}`,
                    "headImg": `${headImg}`,
                    "time": `${getDate()}`,
                    "secound": [],
                })
                DeviceEventEmitter.emit('Key', '待传参数');
                this.setState({});
            })
            .catch(err => {
                console.log(err)
            })
        } else {
            Axios.post(ADD_SECOUND_COMMITS, { cardId: id, commit: commitContent, userid, userName: username, headImg, index: secoundIndex})
            .then(res => {
                cardDetailContent.commits[index].second.unshift({
                    "name": `${username}`,
                    "content": `${commitContent}`,
                    "goods": 0,
                    "userid": `${userid}`,
                    "headImg": `${headImg}`,
                    "time": `${getDate()}`,
                })
                DeviceEventEmitter.emit('Key', '待传参数');
                this.setState({ cardDetailContent: [] });
                setTimeout(() => {
                    this.setState({ cardDetailContent });
                }, 0)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    changeCommits = e => {
        const test = /(^@\s[a-zA-Z0-9_-]+\s)/;
        if(!test.test(e)) {
            this.setState({
                secoundIndex: null,
                isSecound: false,
            })
        }
        this.setState({
            commitContent: e,
        })
    }

    addSecoundCommit = (index, name) => {
        const { isSecound } = this.state;
        if (!isSecound) {
            this.setState({
                commitContent: `@ ${name} `,
                isSecound: true,
                secoundIndex: index,
            })
        }
    }


    render() {
        const { cardDetailContent, cardIdname,
            userName,
            time, headImg, cardId, fromSearch, name, commitContent } = this.state;
        console.log(cardDetailContent.commits);
        return (
            <Container>
                <MyHeader callBack={() => {
                    DeviceEventEmitter.emit('changeShowMode', true);
                    fromSearch && DeviceEventEmitter.emit('showModal');
                }}/>
                <Content>
                    <Card>
                        <CardItem>
                            <Left>
                                <Thumbnail source={{uri: `${headImg}`}} />
                                <Body>
                                    <Text>{userName}</Text>
                                    <Text note>{time}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem cardBody>
                            <Body>
                                <Text>{name}</Text>
                                <Image source={{uri: `${cardDetailContent.bodyImg}`}} style={{height: 200, width: 200, flex: 1}}/>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Text>{cardDetailContent.content}</Text>
                        </CardItem>
                    </Card>

                    <View style={styles.commits}>
                        <Text note style={styles.commitsTitle}>热门评论</Text>
                        {(cardDetailContent.commits || []).map((item, index) => <Card key={index}>
                            <CardItem>
                                <Left>
                                    <Thumbnail source={{uri: `${item.headImg}`}} />
                                    <Body>
                                        <TouchableOpacity onPress ={() => this.addSecoundCommit(index, item.name)}>
                                            <Text>{item.name}</Text>
                                        </TouchableOpacity>
                                        <Text note>{item.time}</Text>
                                    </Body>
                                </Left>
                                {
                                    // <Right>
                                    //     <Button transparent danger onPress={() => this.addGoods(index)}>
                                    //         <Icon name="heart" />
                                    //         <Text>{item.goods}</Text>
                                    //     </Button>
                                    // </Right>
                                }
                            </CardItem>
                            <CardItem cardBody>
                                <Body>
                                    <Text style={{ marginLeft: 10 }}>{item.content}</Text>
                                    {
                                        (item.second || []).length ? item.second.map((item, index) => {
                                            return <Card key={index} style={{ width: '80%', marginLeft: '10%'}}>
                                            <CardItem>
                                                <Left>
                                                    <Thumbnail source={{uri: `${item.headImg}`}} />
                                                    <Body>
                                                        <TouchableOpacity onPress ={() => this.addSecoundCommit(index, item.name)}>
                                                            <Text>{item.name}</Text>
                                                        </TouchableOpacity>
                                                        <Text note>{item.time}</Text>
                                                    </Body>
                                                </Left>
                                            </CardItem>
                                            <CardItem cardBody>
                                                <Body>
                                                    <Text style={{ marginLeft: 10 }}>{item.content}</Text>
                                                </Body>
                                            </CardItem>
                                            <CardItem>
                                            </CardItem>
                                        </Card>
                                        }): null
                                    }
                                </Body>
                            </CardItem>
                            <CardItem>
                            </CardItem>
                        </Card>)}
                    </View>

                    {
                        // <View style={styles.commits}>
                        //     <Text note style={styles.commitsTitle}>所有评论</Text>
                        // </View>
                    }
                </Content>
                <Item regular style={styles.commitsContainer}>
                    <Input placeholder='评论' style={{ height: 40, }} value={commitContent} onChangeText={e => debounce(500)(this.changeCommits(e))}/>
                    <TouchableOpacity onPress ={() => this.addCommit(cardId)}>
                        <FontAwesome name='commenting-o' style={{ fontSize: 20, }}/>
                    </TouchableOpacity>
                </Item>
                <Footer />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       
    },
    commits: {
        marginTop: 20,
    },
    commitsTitle: {
        marginLeft: 20,
    },
    commitsContainer: {
        // marginBottom: 20,
    }
});

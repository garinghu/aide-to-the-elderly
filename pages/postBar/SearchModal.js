import React from 'react';
import { StyleSheet, Modal, TouchableHighlight, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Item, Input, Content, Text, Tab, Tabs, TabHeading, List, ListItem, Thumbnail } from 'native-base';
import Axios from 'axios';

import ShowCard from '../../common/ShowCard';
import { storage } from '../../storage';
import Config from '../../config';

const SEARCH_MESSAGES_BY_TYPE = `${Config.proxy}/searchmessagesbytype`;
const SEARCH_MESSAGES_BY_LIKE = `${Config.proxy}/searchmessagesbylike`;
const SEARCH_USERS_BY_USER_NAME = `${Config.proxy}/searchusersbyusername`;

class SearchModal extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            searchList: [],
            showList: false,
            messageList: [],
            userList: [],
            typeList: [],
        }
    }

    componentDidMount() {
        storage.load('searchList', (data) => {
            this.setState({ searchList: data });
        })
    }

    search = () => {
        const { searchList, text } = this.state;
        if(text != '') {
            storage.load('searchList', (data) => {
                if(!data.includes(text)) {
                    const newList = [...searchList];
                    newList.unshift(text)
                    storage.save('searchList', newList);
                    this.setState({ searchList: newList });
                    storage.load('userInfo', data => {
                        const { userid } = data;
                        Axios.post(SEARCH_MESSAGES_BY_TYPE, { type: text, userid, requestTime: 1 })
                        .then(res => {
                            console.log('typeList', res.data);
                            this.setState({
                                typeList: res.data,
                            })
                        })
                        
                        Axios.post(SEARCH_MESSAGES_BY_LIKE, { search: text, userid, requestTime: 1 })
                        .then(res => {
                            this.setState({
                                messageList: res.data,
                            })
                        })

                        Axios.post(SEARCH_USERS_BY_USER_NAME, { username: text, userid })
                        .then(res => {
                            this.setState({
                                userList: res.data,
                            })
                        })
                    })
                }
                this.setState({ showList: true });
            })
        }
    }

    removeSearch = () => {
        storage.save('searchList', []);
        this.setState({ searchList: [] });
    }

    cardPress = item => {
        const navigation = this.props.navigation;
        navigation.navigate('CardDetail', {
            detail: item,
            fromSearch: true,
        });
        this.props.closeModal();
    }

    toWritterList = item => {
        const navigation = this.props.navigation;
        const { Id, alreadyFriend } = item;
        navigation.navigate('WritterList', { cardWritterId: Id, alreadyFriend, fromSearch: true });
        this.props.closeModal();
    }

    render() {
        const { show, closeModal } = this.props;
        const { searchList, showList, messageList, userList, typeList } = this.state;
        return (
            <Modal
            animationType={"slide"}
            transparent={false}
            visible={show}
            onRequestClose={() => {alert("Modal has been closed.")}}
            >
                <Container>
                    <Header style={{ backgroundColor: '#fff'}}>
                        <Left>
                            <Button transparent onPress={closeModal}>
                                <Text style={{ color: '#ed6560', fontSize: 16 }}>取消</Text>
                            </Button>
                        </Left>
                        <Body>
                            <Item rounded 
                            style={{ height: 30, width: 280, borderColor: '#ed6560', backgroundColor: '#fff' }}>
                                <Input style={{color: '#ed6560'}} placeholder='发现新内容...' 
                                onChangeText={(e) => this.setState({ text: e })}
                                onFocus={() => this.setState({ showList: false })}/>
                            </Item>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => this.search()}>
                                <FontAwesome name='search' style={{ fontSize: 18, fontWeight: 'lighter', color: '#ed6560' }}/>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        {showList ? <Tabs 
                        tabBarUnderlineStyle={{ backgroundColor: '#ed6560' }}>
                            <Tab heading={ <TabHeading>
                                <Text>帖子</Text>
                            </TabHeading>}
                            topTabBarActiveTextColor='#ed6560'> 
                                {(Array.isArray(messageList) ? messageList : []).map((item, index) => <ShowCard 
                                    key={item.id} cardContent={item}
                                    fromSearch={true} 
                                    cardPress={() => this.cardPress(item)}/>)}
                            </Tab>
                            <Tab heading={ <TabHeading>
                                <Text>主题</Text>
                            </TabHeading>}
                            topTabBarActiveTextColor='#ed6560'> 
                                {(Array.isArray(typeList) ? typeList : []).map((item, index) => <ShowCard 
                                    key={item.id} cardContent={item}
                                    fromSearch={true}  
                                    cardPress={() => this.cardPress(item)}/>)}
                            </Tab>
                            <Tab heading={ <TabHeading>
                                <Text>作者</Text>
                            </TabHeading>}
                            topTabBarActiveTextColor='#ed6560'> 
                                <List>
                                    {(Array.isArray(userList) ? userList : []).map((item, index) => <ListItem thumbnail key={index}>
                                    <Left>
                                        <Thumbnail source={{ uri: item.head }} />
                                    </Left>
                                    <Body>
                                        <Text>{item.username}</Text>
                                        <Text note>签名{item.signature}</Text>
                                    </Body>
                                    <Right>
                                        <Button transparent onPress={() => this.toWritterList(item)}>
                                        <Text>查看</Text>
                                        </Button>
                                    </Right>
                                    </ListItem>)}
                                </List>
                            </Tab>
                        </Tabs> : <View>
                            <Text note style={{ marginTop: 10, marginLeft: 10 }}> 最近搜索</Text>
                            {searchList.length ? <TouchableHighlight style={{ position: 'absolute', right: 20, top: 10 }}
                            onPress={() => this.removeSearch()}>
                                <Icon name="md-remove-circle-outline" style={{ fontSize: 18, color: '#ed6560' }}/>
                            </TouchableHighlight> : null}
                            <View style={styles.searchContainer}>
                                {searchList.map((item, index) => <Button style={styles.searchItem} key={index}>
                                    <Text style={{ fontSize: 16, color: '#000' }}>{item}</Text>
                                </Button>)}
                            </View>
                        </View>}
                    </Content>
                </Container>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       flex: 1,
       marginBottom: 30,
    },
    searchContainer: {
        marginTop: 10,
        marginLeft: 10,
        flex: 1,
        flexDirection: 'row',
    },
    searchItem: {
        height: 30, 
        marginLeft: 0, 
        backgroundColor: '#efefef',
        marginRight: 15, 
    }
});

export default withNavigation(SearchModal);


import React, { Component } from 'react';
import { 
	View, 
	Text, 
	Image, 
	Platform,
	FlatList, 
	TextInput, 
	StyleSheet,
	BackHandler,
	TouchableHighlight, 
	KeyboardAvoidingView
} from 'react-native';

import { connect } from 'react-redux';
import { setActiveChat, sendMessage, monitorChat, monitorChatOff } from '../actions/ChatActions'
import MensagemItem from '../components/ConversaInterna/MensagemItem';

export class ConversaInterna extends Component {
	
	static navigationOptions = ({navigation}) => ({
		title:navigation.state.params.title,
		tabBarVisible:false,
		headerLeft:(
			<TouchableHighlight 
				onPress={()=>{navigation.state.params.backFunction()}} 
				underlayColor={false}>
					<Image 
						source={require('react-navigation/src/views/assets/back-icon.png')} 
						style={{width:25, height:25, marginLeft:15}} 
					/>
			</TouchableHighlight>
		)
	})

	constructor(props) {
	  super(props);	
	  this.state = {			
			inputText:''
		};

	  this.back = this.back.bind(this);
	  this.sendMsg = this.sendMsg.bind(this);
	}

	componentDidMount() {
		this.props.navigation.setParams({backFunction:this.back});
		BackHandler.addEventListener('hardwareBackPress', this.back);

		this.props.monitorChat(this.props.activeChat);
	}

	componentWillUnmount(){		
		BackHandler.removeEventListener('hardwareBackPress', this.back);	
	}

	back(){
		this.props.monitorChatOff(this.props.activeChat);
		this.props.setActiveChat('');
		this.props.navigation.goBack();

		return true;
	}

	sendMsg(){
		let txt = this.state.inputText;

		let state = this.state;
		state.inputText = '';
		this.setState(state);

		this.props.sendMessage(txt, this.props.uid, this.props.activeChat);
	}

	render(){
		// TODO: Strings para corrigir a abertura do teclado no IOS
		let AreaBehavior = Platform.select({ios:'padding', android:null});
		let AreaOffset = Platform.select({ios:64, android:null});
		
		return (
			<KeyboardAvoidingView style={styles.container} behavior={AreaBehavior} keyboardVerticalOffset={AreaOffset} >
				<FlatList
					ref={(ref)=>{ this.chatArea = ref }} //TODO: Referenciar o FlatList para o this.chatArea
					onContentSizeChange={()=>{ this.chatArea.scrollToEnd({animated:true}) }} //TODO: Ativar quando houve novo item no flatlist, ir para o final.
					onLayout={()=>{ this.chatArea.scrollToEnd({animated:true}) }} //TODO: Ativar quando ativar o teclado.
					style={styles.chatArea} 
					data={this.props.activeChatMessages}
					renderItem={({item})=><MensagemItem data={item} me={this.props.uid} />}
				/>
				<View style={styles.sendArea}>
					<TextInput style={styles.sendInput} value={this.state.inputText} onChangeText={(inputText)=>this.setState({inputText})} />
					<TouchableHighlight style={styles.sendButton} onPress={this.sendMsg} >
						<Image style={styles.sendImage} source={require('../assets/images/send.png')} />
					</TouchableHighlight>
				</View>
			</KeyboardAvoidingView>
		);
	}

}

const styles = StyleSheet.create({
	container:{
		flex:1
	},
	chatArea:{
		flex:1,
		backgroundColor:'#CCCCCC'
	},
	sendArea:{
		height:50,
		backgroundColor:'#EEEEEE',
		flexDirection: 'row'
	},
	sendInput:{
		height:50,
		flex:1
	},
	sendButton:{
		width:50,
		height:50,
		justifyContent:'center'	,
		alignItems:'center'
	},
	sendImage:{
		width:30,
		height:30	
	}
});

const mapStateToProps = (state) => {
	return {
		status:state.auth.status,
		uid:state.auth.uid,
		activeChat:state.chat.activeChat,
		activeChatMessages:state.chat.activeChatMessages
	};
};

const ConversaInternaConnect = connect(mapStateToProps, { setActiveChat, sendMessage, monitorChat, monitorChatOff })(ConversaInterna);
export default ConversaInternaConnect;
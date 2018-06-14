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
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;

import { connect } from 'react-redux';
import { setActiveChat, sendMessage, monitorChat, sendImage, monitorChatOff } from '../actions/ChatActions'
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
			inputText:'',
			pct:0
		};

	  this.back = this.back.bind(this);
	  this.sendMsg = this.sendMsg.bind(this);
	  this.chooseImage = this.chooseImage.bind(this);
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

		this.props.sendMessage('text', txt, this.props.uid, this.props.activeChat);
	}

	chooseImage(){
		
		ImagePicker.showImagePicker(null, (r)=>{
			if(r.uri) {
				
				let uri = r.uri.replace('file://', '');

				RNFetchBlob.fs.readFile(uri, 'base64')
					.then((data)=>{
						return RNFetchBlob.polyfill.Blob.build(data, {type:'image/jpeg;BASE64'});
					})
					.then((blob)=>{
						this.props.sendImage(
							blob,
							// Parametro de progresso.
							(snapshot)=>{								
								let pct = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100;

								let state = this.state;
								state.pct = pct;
								this.setState(state);

							},
							// Parametro de imagem
							(imgName)=>{
								let state = this.state;
								state.pct = 0;
								this.setState(state);

								this.props.sendMessage('image', imgName, this.props.uid, this.props.activeChat);
						});

					});

			}
		});

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

				{this.state.pct > 0 &&
					<View style={styles.imageTmp}>
						<View style={[{width:this.state.pct+'%'},styles.imageTmpBar]} ></View>
					</View>
				}

				<View style={styles.sendArea}>
					<TouchableHighlight  style={styles.imageButton} onPress={this.chooseImage} >
						<Image style={styles.imageBtnImage}  source={require('../assets/images/img_logo.png')} />
					</TouchableHighlight>
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
	imageButton:{
		width:50,
		height:50,
		justifyContent:'center'	,
		alignItems:'center'
	},
	sendImage:{
		width:30,
		height:30	
	},
	imageBtnImage:{
		width:30,
		height:30
	},
	imageTmp:{
		height: 10
	},
	imageTmpBar:{
		height: 10,
		backgroundColor:'#FF0000'
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

const ConversaInternaConnect = connect(mapStateToProps, { setActiveChat, sendMessage, monitorChat, sendImage, monitorChatOff })(ConversaInterna);
export default ConversaInternaConnect;
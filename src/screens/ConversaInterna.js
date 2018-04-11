import React, { Component } from 'react';
import { View, Text, Image, BackHandler, StyleSheet, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { setActiveChat } from '../actions/ChatActions'

export class ConversaInterna extends Component {
	
	static navigationOptions = ({navigation}) => ({
		title:navigation.state.params.title,
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
	  this.state = {};

	  this.back = this.back.bind(this);
	}

	componentDidMount() {
		this.props.navigation.setParams({backFunction:this.back});
		BackHandler.addEventListener('hardwareBackPress', this.back);
	}

	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress', this.back);
	}

	back(){
		this.props.setActiveChat('');
		this.props.navigation.goBack();

		return true;
	}

	render(){
		return (
			<View style={styles.container}>
				<Text>Página CONVERSA INTERNA</Text>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container:{
		flex:1,
		margin:10
	}
});

const mapStateToProps = (state) => {
	return {
		status:state.auth.status,
		uid:state.auth.uid
	};
};

const ConversaInternaConnect = connect(mapStateToProps, { setActiveChat })(ConversaInterna);
export default ConversaInternaConnect;
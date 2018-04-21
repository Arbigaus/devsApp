import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Keyboard } from 'react-native';

import { connect } from 'react-redux';
import { checkLogin, changeName, changeEmail, changePasswd, signInAction } from '../actions/AuthActions';

import LoadingItem from '../components/LoadingItem';

export class SignIn extends Component {
	
	static navigationOptions = {
		title:'Entrar'
	}

	constructor(props) {
	  super(props);	
	  this.state = {
	  	loading:false
	  };
	}

	componentDidUpdate(){
		if(this.props.status == 1){
			Keyboard.dismiss();
			this.props.navigation.navigate('Conversas');
		}
	}

	render(){
		return (
			<View style={styles.container}>
				<View style={styles.inputArea} >
					<Text>E-mail:</Text>
					<TextInput style={styles.input} value={this.props.email} onChangeText={this.props.changeEmail} />

					<Text>Senha:</Text>
					<TextInput secureTextEntry={true} style={styles.input} value={this.props.passwd} onChangeText={this.props.changePasswd} />

				</View>
				<View style={styles.buttonArea}>
					<Button title="Entrar" onPress={()=>{
						this.setState({loading:true});
						this.props.signInAction(this.props.email, this.props.passwd, ()=>{
							this.setState({loading:false});
						});
					}} />
				</View>

				<LoadingItem visible={this.state.loading} />
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container:{
		flex:1,
		alignItems: 'center',
		margin:10
	},
	inputArea:{
		width: '100%',
		padding: 10
	},
	input:{
		marginBottom: 5,
		fontSize: 20
	},	
	buttonArea:{
		height: 100,
		width: 160,
		justifyContent: 'space-between',
		padding: 10
	}
});

const mapStateToProps = (state) => {
	return {
		email:state.auth.email,
		passwd:state.auth.passwd,
		uid:state.auth.uid,
		status:state.auth.status
	};
};

const SignInConnect = connect(mapStateToProps, { changeEmail, changePasswd, signInAction })(SignIn);
export default SignInConnect;
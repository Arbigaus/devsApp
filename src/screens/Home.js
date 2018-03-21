import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { checkLogin } from '../actions/AuthActions';

export class Home extends Component {
	
	static navigationOptions = {
		title:'',
		header:null
	}

	constructor(props) {
	  super(props);	
	  this.state = {};

	  this.signinButtom = this.signinButtom.bind(this);
	  this.signupButtom = this.signupButtom.bind(this);
	}

	signinButtom() {
		this.props.navigation.navigate('SignIn');
	}

	signupButtom() {
		this.props.navigation.navigate('SignUp');
	}

	render(){
		return (
			<View style={styles.container}>
				<Text style={styles.h1}>Devsapp 1.0</Text>
				<View style={styles.buttonArea}>
					<Button onPress={this.signinButtom} title="Login" />
					<Button color="green" onPress={this.signupButtom} title="Cadastrar" />
				</View>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container:{
		flex:1,
		justifyContent: 'center',
		alignItems: 'center',
		margin:10
	},
	h1:{
		fontSize: 30
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
		status:state.auth.status
	};
};

const HomeConnect = connect(mapStateToProps, { checkLogin })(Home);
export default HomeConnect;
import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import { SignOut } from '../actions/AuthActions';

export class Config extends Component {
	
	static navigationOptions = {
		title:'',
		tabBarLabel:'Config.',
		header:null
	}

	constructor(props) {
	  super(props);	
	  this.state = {};

	  this.sair = this.sair.bind(this);
	}

	sair(){
		this.props.SignOut();

		window.globalNavigator.navigate('Home');		
	}

	render(){
		return (
			<View style={styles.container}>
				<Text>Página CONFIG</Text>
				<Button color="red" title="Sair" onPress={this.sair} />
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

const ConfigConnect = connect(mapStateToProps, { SignOut })(Config);
export default ConfigConnect;
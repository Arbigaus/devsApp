import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import { checkLogin } from '../actions/AuthActions';

export class Preload extends Component {
	
	static navigationOptions = {
		title:'',
		header:null
	}

	constructor(props) {
	  super(props);	
	  this.state = {};

	  this.directPages = this.directPages.bind(this);
		this.props.checkLogin();
		
		// TODO: Definir global Navigator para ter acesso às telas em qualquer ponto do app.
		window.globalNavigator = this.props.navigation;

	}

	directPages() {

		switch(this.props.status) {
			case 1:
				this.props.navigation.dispatch(NavigationActions.reset({
				index:0,
				actions:[
					NavigationActions.navigate({routeName:'Conversas'})
				]
			}));

				break;
			case 2:
				this.props.navigation.dispatch(NavigationActions.reset({
				index:0,
				actions:[
					NavigationActions.navigate({routeName:'Home'})
				]
			}));
				break;
		}
	}

	componentDidMount() {
		this.directPages();
	}

	componentDidUpdate() {
		this.directPages();
	}

	render(){
		return (
			<View style={styles.container}>
				<Text style={styles.title} >DevsApp 1.0</Text>
				<Image source={require('../images/logo.png')} style={styles.img} />
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container:{
		flex:1,
		justifyContent: 'center',
		alignItems:'center'
	},
	img:{
		width:100,
		height:100
	},
	title:{
		fontSize: 20,
		fontWeight: 'bold'
	}
});

const mapStateToProps = (state) => {
	return {
		status:state.auth.status
	};
};

const PreloadConnect = connect(mapStateToProps, { checkLogin })(Preload);
export default PreloadConnect;
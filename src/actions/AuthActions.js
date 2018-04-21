import firebase from '../FirebaseConn';

export const SignOut = () => {
	firebase.auth().signOut();

	return {
		type:'changeStatus',
		payload:{
			status:2
		}
	};
};

export const checkLogin = () => {

	return (dispatch) => {

		firebase.auth().onAuthStateChanged((user)=>{

			if(user){
				// Usuário está logado
				dispatch({
					type:'changeUid',
					payload:{
						uid:user.uid
					}
				});
			} else {
				// Usuário não está logado
				dispatch({
					type:'changeStatus',
					payload:{
						status:2
					}
				});
			}
		});
	}
};

export const signUpAction = (name, email, passwd, callback) =>{
		// alert(passwd+' - '+email+' - '+name);
	return (dispatch) => {
		firebase.auth().createUserWithEmailAndPassword(email, passwd)
			.then((user)=>{

				let uid = firebase.auth().currentUser.uid;

				firebase.database().ref('users').child(uid).set({
					name:name
				});

				callback();

				dispatch({
					type:'changeUid',
					payload:{
						uid:uid
					}
				});

			})
			.catch((error)=>{
				switch(error.code) {
					case 'auth/email-already-in-use':
						alert("E-mail já cadastrado.");
						break;
					case 'auth/invalid-email':
						alert("E-mail inválido!")
						break;
					case 'auth/operation-not-allowed':
						alert("Tente novamente mais tarde!");
						break;
					case 'auth/weak-password':
						alert("Digite uma senha melhor!");
						break;
				}
				callback();
			});

	};
};

export const signInAction = (email, passwd, callback)=>{
	return(dispatch)=>{
		firebase.auth().signInWithEmailAndPassword(email, passwd)
			.then((user)=>{

				let uid = firebase.auth().currentUser.uid;

				callback();
				
				dispatch({
					type:'changeUid',
					payload:{
						uid:uid
					}
				});

			})
			.catch((error)=>{
				switch(error.code) {
					case 'auth/invalid-email':
						alert("E-mail Inválido.");
						break;
					case 'auth/user-disabled':
						alert("Usuário Inativo.");
						break;
					case 'auth/user-not-found':
						alert("Usuário não encontrado");
						break;
					case 'auth/wrong-password':
						alert("E-mail ou Senha inválida!");
						break;
				}
				callback();
			});
	};
};

export const changeEmail = (email) => {
	return {
		type:'changeEmail',
		payload:{
			email:email
		}
	}
};

export const changePasswd = (passwd) => {
	return {
		type: 'changePasswd',
		payload:{
			passwd:passwd
		}
	}
};

export const changeName = (name) => {
	return {
		type: 'changeName',
		payload:{
			name:name
		}
	}
};
import firebase from '../FirebaseConn';

export const getChatList = ( userUid ) => {
	return (dispatch) => {

		firebase.database().ref('users').child(userUid).child('chats').on('value', (snapshot)=>{
			let chats = [];

			snapshot.forEach((childItem)=>{
				chats.push({
					key:childItem.key,
					user:childItem.val().user
				});
			});

			dispatch({
				type:'setChatList',
				payload:{
					chats:chats
				}
			});

		});

	};
};

export const getContactList = ( userUid ) => {
	return (dispatch) => {
		firebase.database().ref('users').orderByChild('name').once('value').then((snapshot)=>{

			let users = [];
			snapshot.forEach((childItem)=>{
				if(childItem.key != userUid){
					users.push({
						key:childItem.key,
						name:childItem.val().name
					});
				}

			});

			dispatch({
				type:'setContactList',
				payload:{
					users:users
				}
			})
		});
	}
}

export const createChat = (userUid1, userUid2) => {
	return (dispatch) => {

		// TODO: Criando o próprio CHAT
		let newChat = firebase.database().ref('chats').push();
		newChat.child('members').child(userUid1).set({
			id:userUid1
		});
		newChat.child('members').child(userUid2).set({
			id:userUid2
		});

		//TODO: Associando o chat aos envolvidos
		let chatId = newChat.key;
		let user1 = '';
		let user2 = '';

		firebase.database().ref('users').child(userUid1).once('value').then((snapshot)=>{
			user1 = snapshot.val().name;
			firebase.database().ref('users').child(userUid2).child('chats')
				.child(chatId).set({
					id:chatId,
					user:user1
			});
		});

		firebase.database().ref('users').child(userUid2).once('value').then((snapshot)=>{
			user2 = snapshot.val().name;
			firebase.database().ref('users').child(userUid1).child('chats')
				.child(chatId).set({
					id:chatId,
					user:user2
			});
		});

		dispatch({
			type:'setActiveChat',
			payload:{
				chatId:chatId
			}
		});
		
	}
}

export const setActiveChat = (chatId) => {
	return {
		type:'setActiveChat',
		payload:{
			chatId:chatId
		}
	};
};

/*
export const signInAction = (email, passwd)=>{
	return(dispatch)=>{
		firebase.auth().signInWithEmailAndPassword(email, passwd)
			.then((user)=>{

				let uid = firebase.auth().currentUser.uid;
				
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
			});
	};
};
*/
// export const changeName = (name) => {
// 	return {
// 		type: 'changeName',
// 		payload:{
// 			name:name
// 		}
// 	}
// };
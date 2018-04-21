import firebase from '../FirebaseConn';

export const getChatList = ( userUid ) => {
	return (dispatch) => {

		// alert("hello");

		firebase.database().ref('users').child(userUid).child('chats').on('value', (snapshot)=>{
			let chats = [];

			snapshot.forEach((childItem)=>{
				chats.push({
					key:childItem.key,
					title:childItem.val().title
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
			id:userUid1 // Usuário logado
		});
		newChat.child('members').child(userUid2).set({
			id:userUid2 // Segundo usuário do chat
		});

		//TODO: Associando o chat aos envolvidos
		let chatId = newChat.key;

		firebase.database().ref('users').child(userUid1).once('value').then((snapshot)=>{
			firebase.database().ref('users').child(userUid2).child('chats')
				.child(chatId).set({
					id:chatId,
					title:snapshot.val().name
			});
		});

		firebase.database().ref('users').child(userUid2).once('value').then((snapshot)=>{
			firebase.database().ref('users').child(userUid1).child('chats')
				.child(chatId).set({
					id:chatId,
					title:snapshot.val().name
				})
				.then(()=>{
					dispatch({
						type:'setActiveChat',
						payload:{
							chatId:newChat.key
						}
					});
				});
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

export const sendMessage = (txt, author, activeChat) => {
	return (dispatch) => {
		let currentDate = '';
		let cDate = new Date();

		//YYY-MM-DD HH:ii:SS
		currentDate = cDate.getFullYear()+'-'+(cDate.getMonth()+1)+'-'+cDate.getDate();
		currentDate +=' ';
		currentDate += cDate.getHours()+':'+cDate.getMinutes()+':'+cDate.getSeconds();

		let msgId = firebase.database().ref('chats').child(activeChat).child('messages').push();

		msgId.set({
			date:currentDate,
			m:txt,
			uid:author
		});

	}
}

export const monitorChat = (activeChat) => {
	return (dispatch) => {
		firebase.database().ref('chats').child(activeChat).child('messages').orderByChild('date').on('value', (snapshot) => {
			let arrayMsg = [];
			
			snapshot.forEach((childItem)=>{
				arrayMsg.push({
					key:childItem.key,
					date:childItem.val().date,
					m:childItem.val().m,
					uid:childItem.val().uid
				});
			});

			dispatch({
				type:'setActiveChatMessage',
				payload:{
					'msgs':arrayMsg
				}
			});

		});
	};
}

export const monitorChatOff = (activeChat) => {
	return (dispatch) => {
		// alert(activeChat);
		firebase.database().ref('chats').child(activeChat).child('messages').off();
	};
}

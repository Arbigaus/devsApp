const initialState = {
	name:'',
	email:'',
	passwd:'',
	uid:'',
	status:0
};

const AuthReducer = (state = initialState, action) => {
	if(action.type == 'changeStatus'){
		return {...state, status:action.payload.status};
	}

	if(action.type == 'changeName'){
		return {...state, name:action.payload.name};
	}

	if(action.type == 'changeEmail'){
		return {...state, email:action.payload.email};
	}

	if(action.type == 'changePasswd'){
		return {...state, passwd:action.payload.passwd};
	}

	if(action.type == 'changeUid'){
		return {...state, status:1, uid:action.payload.uid};
	}

	return state;
};

export default AuthReducer;
import { toast } from 'sonner';
import { sessionService } from '../_session';
import { localService } from '../_session/local';


export const errorHandler = (res) => {
	if (res.status === 401) {
		sessionService.clearAll();
		localService.clearAll();
		window.location.href = "/login";
	}
	let result = Array.isArray(res.data.message);
	if (result) {
		toast.error(res.data.message[0]);
		return;
	} else {
		toast.error(res.data.message);
		return;
	}
}
export const successHandler = (msg) => {
	toast.success(msg);
}
export const successHandler12 = (msg) => {
	toast.success(msg);
}

export const waringhandler = (msg) => {
	// toast.warn(msg);
}

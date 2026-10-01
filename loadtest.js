import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 10,
    duration: '10s',
};

export default function () {
    const res = http.get(
        'http://taskLB-1764337148.ap-south-1.elb.amazonaws.com/api/auth'
    );

    console.log(`Status: ${res.status}`);

    check(res, {
        'status is 200': (r) => r.status === 200,
    });
}
import axios from 'axios';

const instance =  axios.create({baseURL: 'https://rctiplus.addpush.com/probes/event.php'});
const data = {
      'event-type': 'click',
      'event-name': 'gold',
      'event-value': {
        'sponsor_id': '32',
        'channel_id': '2',
        'channel_type':'test',
        'clicked_type': 'clik',
        'type': 'test',
      },
      'device-id': '24242343',
      'user-id': 'test',
      'content-id': '24234',
    };

export const RPLUSAdsShowing = () => {
  instance.post('',data)
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
};

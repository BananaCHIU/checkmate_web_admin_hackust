import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

//react-date-range
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import { BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, Brush } from 'recharts';

//heatmap
import Chart from 'react-apexcharts';

//tensorflow
import '@tensorflow/tfjs-backend-cpu';
import * as tf from '@tensorflow/tfjs';
import { Tensor } from '@tensorflow/tfjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  boxShadow: 24,
  p: 4,
};

const loading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <CircularProgress />
  </Box>
);

const SUCCESS = 0;
const LATE = 1;
const WALK_IN = 2;
const NO_SHOW = 3;

const bookings = [
  {
    "booking_id": "0903937d-b579-4394-9b54-51cf697b9f55",
    "booking_time": "2022-01-15T13:32:25.739Z",
    "start_time": "2022-01-15T13:30:00.000Z",
    "end_time": "2022-01-15T14:00:00.000Z",
    "duration": 30,
    "remark": "",
    "checkin_records": [
      {
        "checkin_id": "e0b58410-013a-44e5-a3e0-67d7354588e6",
        "checkin_time": "2022-01-15T13:32:35.000Z",
        "user_id": "291dc4ac-47e7-457c-b95a-b1c89c66299a",
        "status": "Success",
        "remark": ""
      }
    ]
  },
  {
    "booking_id": "3efac1f3-a9b7-4070-a91b-d2fb6dad0b38",
    "booking_time": "2022-01-17T06:45:16.674Z",
    "start_time": "2022-01-17T07:00:00.000Z",
    "end_time": "2022-01-17T08:00:00.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": [
      {
        "checkin_id": "e88e7c0d-232a-418b-95fb-638d920b37b5",
        "checkin_time": "2022-01-17T07:38:33.000Z",
        "user_id": "291dc4ac-47e7-457c-b95a-b1c89c66299a",
        "status": "Late",
        "remark": ""
      }
    ]
  },
  {
    "booking_id": "13eab45e-ba37-4e08-8b19-09821df47230",
    "booking_time": "2022-04-10T09:59:57.485Z",
    "start_time": "2022-04-11T02:30:00.000Z",
    "end_time": "2022-04-11T04:00:00.000Z",
    "duration": 90,
    "remark": "3",
    "checkin_records": []
  },
  {
    "booking_id": "2170f36f-4747-457d-9f53-aed1ebf8b420",
    "booking_time": "2022-02-14T13:03:19.215Z",
    "start_time": "2022-02-20T07:51:24.000Z",
    "end_time": "2022-02-20T09:51:24.000Z",
    "duration": 120,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "2561a1ee-29db-440d-8c9b-1349311268ef",
    "booking_time": "2022-02-14T13:04:37.144Z",
    "start_time": "2022-02-28T10:33:05.000Z",
    "end_time": "2022-02-28T11:33:05.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "270f6b08-21e6-46e2-8116-f8529c2ee694",
    "booking_time": "2022-03-21T12:08:37.773Z",
    "start_time": "2022-03-21T02:30:00.000Z",
    "end_time": "2022-03-21T05:00:00.000Z",
    "duration": 150,
    "remark": "Create Test 2",
    "checkin_records": []
  },
  {
    "booking_id": "29e54e03-29d3-46b5-bb58-d78d7b584555",
    "booking_time": "2022-02-27T16:16:32.519Z",
    "start_time": "2022-02-28T01:30:00.000Z",
    "end_time": "2022-02-28T04:30:00.000Z",
    "duration": 180,
    "remark": "Test 2-2",
    "checkin_records": []
  },
  {
    "booking_id": "3856ae9b-50e4-4f2e-a2a8-e7afc5b030c9",
    "booking_time": "2022-02-27T16:18:03.913Z",
    "start_time": "2022-02-28T08:00:00.000Z",
    "end_time": "2022-02-28T10:30:00.000Z",
    "duration": 150,
    "remark": "Test 4",
    "checkin_records": []
  },
  {
    "booking_id": "3a1ccfd9-1667-484a-8c18-7c0344f1e738",
    "booking_time": "2022-04-14T05:23:33.490Z",
    "start_time": "2022-05-31T01:00:00.000Z",
    "end_time": "2022-05-31T01:30:00.000Z",
    "duration": 30,
    "remark": "1",
    "checkin_records": []
  },
  {
    "booking_id": "46b7486f-fe29-42f7-9c19-9ff92c7dc8da",
    "booking_time": "2022-04-14T05:29:22.015Z",
    "start_time": "2022-05-31T02:30:00.000Z",
    "end_time": "2022-05-31T04:00:00.000Z",
    "duration": 90,
    "remark": "3",
    "checkin_records": []
  },
  {
    "booking_id": "47558bc3-ee55-4ed5-873f-e30dfc9ab888",
    "booking_time": "2022-02-14T13:04:04.406Z",
    "start_time": "2022-02-21T09:51:24.000Z",
    "end_time": "2022-02-21T10:51:24.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "4a29776d-5653-437c-977d-76ff2cc6551d",
    "booking_time": "2022-02-14T12:59:40.625Z",
    "start_time": "2022-02-17T11:00:24.000Z",
    "end_time": "2022-02-17T12:00:24.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "53794e93-f343-4490-a04a-47359dc2cc09",
    "booking_time": "2022-02-14T13:03:03.221Z",
    "start_time": "2022-02-19T14:51:24.000Z",
    "end_time": "2022-02-19T16:51:24.000Z",
    "duration": 120,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "7575e6b5-25fa-4319-9fb6-d2cd2c850493",
    "booking_time": "2022-04-14T05:28:41.397Z",
    "start_time": "2022-05-31T01:30:00.000Z",
    "end_time": "2022-05-31T02:30:00.000Z",
    "duration": 60,
    "remark": "2",
    "checkin_records": []
  },
  {
    "booking_id": "7aa4068b-50ab-4941-8817-6c9c9dca3403",
    "booking_time": "2022-03-13T16:02:51.511Z",
    "start_time": "2022-03-13T17:00:00.000Z",
    "end_time": "2022-03-13T18:00:00.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "84e65830-3402-4274-b0bc-983971c7e319",
    "booking_time": "2022-02-26T01:16:01.486Z",
    "start_time": "2022-02-25T08:00:00.000Z",
    "end_time": "2022-02-25T09:00:00.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "97732a20-b759-4a07-9e10-0f2ffb2983d8",
    "booking_time": "2022-02-14T13:01:30.596Z",
    "start_time": "2022-02-18T18:51:24.000Z",
    "end_time": "2022-02-18T22:51:24.000Z",
    "duration": 240,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "9c0f11d7-e744-497e-8840-7e6a585fc4d8",
    "booking_time": "2022-02-26T01:16:36.825Z",
    "start_time": "2022-02-26T08:00:00.000Z",
    "end_time": "2022-02-26T09:00:00.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "a12d0c0c-0e36-4c8a-9c8b-1fc73e9ae943",
    "booking_time": "2022-04-10T09:52:39.663Z",
    "start_time": "2022-04-11T01:00:00.000Z",
    "end_time": "2022-04-11T01:30:00.000Z",
    "duration": 30,
    "remark": "1",
    "checkin_records": []
  },
  {
    "booking_id": "a1baf60e-7edb-43a8-a54a-18307292a7c6",
    "booking_time": "2022-01-20T11:33:56.991Z",
    "start_time": "2022-01-21T08:00:00.000Z",
    "end_time": "2022-01-21T09:00:00.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "a5fcd671-a652-44bb-844b-750656603522",
    "booking_time": "2022-01-17T06:50:59.772Z",
    "start_time": "2022-01-17T10:00:00.000Z",
    "end_time": "2022-01-17T11:00:00.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "a68f8c01-a9e6-4ae7-8c2f-0f1f9bbc2505",
    "booking_time": "2022-02-14T12:58:35.296Z",
    "start_time": "2022-02-16T22:00:24.000Z",
    "end_time": "2022-02-17T00:00:24.000Z",
    "duration": 120,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "ac2d7d49-b8f3-45dc-a417-7f9297ec045f",
    "booking_time": "2022-02-27T16:15:56.601Z",
    "start_time": "2022-02-28T02:00:00.000Z",
    "end_time": "2022-02-28T03:30:00.000Z",
    "duration": 90,
    "remark": "Test 1",
    "checkin_records": []
  },
  {
    "booking_id": "b6114979-ed63-476d-8d1d-a5caf5b7b19d",
    "booking_time": "2022-02-14T13:03:42.645Z",
    "start_time": "2022-02-20T09:51:24.000Z",
    "end_time": "2022-02-20T10:51:24.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "bceaf09e-d6c6-423c-9683-42341663735a",
    "booking_time": "2022-02-27T16:07:23.185Z",
    "start_time": "2022-02-28T02:00:00.000Z",
    "end_time": "2022-02-28T03:00:00.000Z",
    "duration": 60,
    "remark": "Add Test",
    "checkin_records": []
  },
  {
    "booking_id": "c945af3e-21e9-4525-abd7-ace6de514f97",
    "booking_time": "2022-04-10T11:49:02.650Z",
    "start_time": "2022-04-11T01:30:00.000Z",
    "end_time": "2022-04-11T02:30:00.000Z",
    "duration": 60,
    "remark": "2",
    "checkin_records": []
  },
  {
    "booking_id": "cadc1a6f-0cc4-49a4-8536-f19072a84a3c",
    "booking_time": "2022-02-14T12:56:35.666Z",
    "start_time": "2022-02-22T12:51:24.000Z",
    "end_time": "2022-02-22T13:51:24.000Z",
    "duration": 60,
    "remark": "Test 2",
    "checkin_records": []
  },
  {
    "booking_id": "cc9a35ce-a080-47e5-bde3-9bc6ab841ff3",
    "booking_time": "2022-02-27T16:20:28.650Z",
    "start_time": "2022-02-28T02:30:00.000Z",
    "end_time": "2022-02-28T06:30:00.000Z",
    "duration": 240,
    "remark": "Test 5",
    "checkin_records": []
  },
  {
    "booking_id": "d58e0dad-cebe-4207-9599-5b554535eba3",
    "booking_time": "2022-01-20T11:33:38.728Z",
    "start_time": "2022-01-17T10:00:00.000Z",
    "end_time": "2022-01-17T11:00:00.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "e712c60d-53d8-44d2-912e-9e7d8ce15891",
    "booking_time": "2022-02-27T16:17:24.339Z",
    "start_time": "2022-02-28T04:30:00.000Z",
    "end_time": "2022-02-28T05:00:00.000Z",
    "duration": 30,
    "remark": "Test 3",
    "checkin_records": []
  },
  {
    "booking_id": "f4f8b587-1aee-49f1-91b1-ad17275e01f7",
    "booking_time": "2022-01-17T06:45:42.279Z",
    "start_time": "2022-01-17T09:00:00.000Z",
    "end_time": "2022-01-17T10:00:00.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "f6eaefc1-9847-4145-b1a9-94fb5414f2db",
    "booking_time": "2022-02-14T13:04:25.877Z",
    "start_time": "2022-02-21T08:51:24.000Z",
    "end_time": "2022-02-21T12:51:24.000Z",
    "duration": 240,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "f81472c3-af4f-4863-ab54-0f01faeee2db",
    "booking_time": "2022-02-14T13:00:53.887Z",
    "start_time": "2022-02-18T10:51:24.000Z",
    "end_time": "2022-02-18T12:51:24.000Z",
    "duration": 120,
    "remark": "",
    "checkin_records": []
  }
];

const checkins = [{"checkin_id":"e0b58410-013a-44e5-a3e0-67d7354588e6","checkin_time":"2022-01-15T13:32:35.000Z","user_id":"291dc4ac-47e7-457c-b95a-b1c89c66299a","status":"Success","remark":""},{"checkin_id":"e88e7c0d-232a-418b-95fb-638d920b37b5","checkin_time":"2022-01-17T07:38:33.000Z","user_id":"291dc4ac-47e7-457c-b95a-b1c89c66299a","status":"Late","remark":""}];
const locationTypes = [
  {
    "location_type_id": "14ae79b0-de34-4db8-af3f-5e95cdaaa062",
    "location_type": "3D Printers",
    "float_value": 4.5,
  },
  {
    "location_type_id": "33b3ddb6-7422-4a50-b376-eb50a9b7334b",
    "location_type": "3D Scanner",
    "float_value": 4.1884765625,
  },
  {
    "location_type_id": "3590ea85-52c8-4d30-8e19-f2805ef2b104",
    "location_type": "Group Study Rooms",
    "float_value": 4.642578125,
  },
  {
    "location_type_id": "4c204dd4-311f-4fb8-81ef-2c13a6ca43a2",
    "location_type": "Teaching Venues & Interview Rm",
    "float_value": 4.373046875,
  },
  {
    "location_type_id": "97a925ee-d5ac-4f7a-8304-0805a668c79c",
    "location_type": "LC Creative Media Zone",
    "float_value": 4.4775390625,
  },
  {
    "location_type_id": "a96bf430-5f0f-4034-a192-d6c8fa8dff1e",
    "location_type": "Computers",
    "float_value": 4.7626953125,
  },
  {
    "location_type_id": "ae6824bf-8d53-4beb-8c40-6165202a3e61",
    "location_type": "Group Study Rooms (LC)",
    "float_value": 4.576171875,
  },
  {
    "location_type_id": "e9b44ab8-1a28-4f3c-8ea8-5ec5e48d1b10",
    "location_type": "Media & Discussion Rooms",
    "float_value": 4.29296875,
  }
];

const userTypes = [
  {
    "user_type_id": "7784a7fe-046e-43d3-8223-6f1934c203f4",
    "user_type": "Staff",
    "float_value": 4.4384765625,
  },
  {
    "user_type_id": "c151a874-9ece-4ea8-8708-0f3747e44cee",
    "user_type": "Student",
    "float_value": 4.21484375,
  },
  {
    "user_type_id": "c9bfa4cb-c287-40d6-b85a-3d9e022f446f",
    "user_type": "Guest",
    "float_value": 4.32421875,
  },
  {
    "user_type_id": "f89f58f7-a131-4b54-9998-12435b23f4df",
    "user_type": "Admin",
    "float_value": 4.5302734375,
  }
];

const dailyBookings = [
  {
    "booking_id": "2561a1ee-29db-440d-8c9b-1349311268ef",
    "booking_time": "2022-02-14T13:04:37.144Z",
    "start_time": "2022-02-28T10:33:05.000Z",
    "end_time": "2022-02-28T11:33:05.000Z",
    "duration": 60,
    "remark": "",
    "checkin_records": []
  },
  {
    "booking_id": "29e54e03-29d3-46b5-bb58-d78d7b584555",
    "booking_time": "2022-02-27T16:16:32.519Z",
    "start_time": "2022-02-28T01:30:00.000Z",
    "end_time": "2022-02-28T04:30:00.000Z",
    "duration": 180,
    "remark": "Test 2-2",
    "checkin_records": []
  },
  {
    "booking_id": "3856ae9b-50e4-4f2e-a2a8-e7afc5b030c9",
    "booking_time": "2022-02-27T16:18:03.913Z",
    "start_time": "2022-02-28T08:00:00.000Z",
    "end_time": "2022-02-28T10:30:00.000Z",
    "duration": 150,
    "remark": "Test 4",
    "checkin_records": []
  },
  {
    "booking_id": "ac2d7d49-b8f3-45dc-a417-7f9297ec045f",
    "booking_time": "2022-02-27T16:15:56.601Z",
    "start_time": "2022-02-28T02:00:00.000Z",
    "end_time": "2022-02-28T03:30:00.000Z",
    "duration": 90,
    "remark": "Test 1",
    "checkin_records": []
  },
  {
    "booking_id": "bceaf09e-d6c6-423c-9683-42341663735a",
    "booking_time": "2022-02-27T16:07:23.185Z",
    "start_time": "2022-02-28T02:00:00.000Z",
    "end_time": "2022-02-28T03:00:00.000Z",
    "duration": 60,
    "remark": "Add Test",
    "checkin_records": []
  },
  {
    "booking_id": "cc9a35ce-a080-47e5-bde3-9bc6ab841ff3",
    "booking_time": "2022-02-27T16:20:28.650Z",
    "start_time": "2022-02-28T02:30:00.000Z",
    "end_time": "2022-02-28T06:30:00.000Z",
    "duration": 240,
    "remark": "Test 5",
    "checkin_records": []
  },
  {
    "booking_id": "e712c60d-53d8-44d2-912e-9e7d8ce15891",
    "booking_time": "2022-02-27T16:17:24.339Z",
    "start_time": "2022-02-28T04:30:00.000Z",
    "end_time": "2022-02-28T05:00:00.000Z",
    "duration": 30,
    "remark": "Test 3",
    "checkin_records": []
  }
];

const prediction_result = {
  "0903937d-b579-4394-9b54-51cf697b9f55":3,
  "3efac1f3-a9b7-4070-a91b-d2fb6dad0b38":1,
  "13eab45e-ba37-4e08-8b19-09821df47230":1,
  "2170f36f-4747-457d-9f53-aed1ebf8b420":0,
  "2561a1ee-29db-440d-8c9b-1349311268ef":2,
  "270f6b08-21e6-46e2-8116-f8529c2ee694":1,
  "29e54e03-29d3-46b5-bb58-d78d7b584555":1,
  "3856ae9b-50e4-4f2e-a2a8-e7afc5b030c9":2,
  "3a1ccfd9-1667-484a-8c18-7c0344f1e738":2,
  "46b7486f-fe29-42f7-9c19-9ff92c7dc8da":2,
  "47558bc3-ee55-4ed5-873f-e30dfc9ab888":1,
  "4a29776d-5653-437c-977d-76ff2cc6551d":2,
  "53794e93-f343-4490-a04a-47359dc2cc09":3,
  "7575e6b5-25fa-4319-9fb6-d2cd2c850493":2,
  "7aa4068b-50ab-4941-8817-6c9c9dca3403":0,
  "84e65830-3402-4274-b0bc-983971c7e319":1,
  "97732a20-b759-4a07-9e10-0f2ffb2983d8":0,
  "9c0f11d7-e744-497e-8840-7e6a585fc4d8":0,
  "a12d0c0c-0e36-4c8a-9c8b-1fc73e9ae943":1,
  "a1baf60e-7edb-43a8-a54a-18307292a7c6":2,
  "a5fcd671-a652-44bb-844b-750656603522":1,
  "a68f8c01-a9e6-4ae7-8c2f-0f1f9bbc2505":1,
  "ac2d7d49-b8f3-45dc-a417-7f9297ec045f":1,
  "b6114979-ed63-476d-8d1d-a5caf5b7b19d":0,
  "bceaf09e-d6c6-423c-9683-42341663735a":1,
  "c945af3e-21e9-4525-abd7-ace6de514f97":1,
  "cadc1a6f-0cc4-49a4-8536-f19072a84a3c":2,
  "cc9a35ce-a080-47e5-bde3-9bc6ab841ff3":1,
  "d58e0dad-cebe-4207-9599-5b554535eba3":2,
  "e712c60d-53d8-44d2-912e-9e7d8ce15891":1,
  "f4f8b587-1aee-49f1-91b1-ad17275e01f7":1,
  "f6eaefc1-9847-4145-b1a9-94fb5414f2db":1,
  "f81472c3-af4f-4863-ab54-0f01faeee2db":2
};

const Home = () => {

  //States
  const [startDate, setStartDate] = useState(moment('2022-01-01').startOf('day'));
  const [endDate, setEndDate] = useState(moment().endOf('day'));
  const [openDateSelector, setOpenDateSelector] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [selected, setSelected] = useState('week');
  const [predictionDate, setPredictionDate] = useState(moment('2022-02-28'));

  const [bookcheckData, setBookcheckData] = useState(null);
  const [bookingHeatmap, setBookingHeatmap] = useState([]);
  const [checkinHeatmap, setCheckinHeatmap] = useState([]);

  function prepareHeatmapsData() {
    //init Booking and Check-in Heatmap data
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    const bookingHeatmapData = [];
    const checkinHeatmapData = [];
    weekdays.forEach((weekday) => {
      const bookHeat = { name: weekday, data: [] };
      const checkHeat = { name: weekday, data: [] };
      months.forEach((month) => {
        bookHeat.data.push({ x: month, y: 0 });
        checkHeat.data.push({ x: month, y: 0 });
      });
      bookingHeatmapData.push(bookHeat);
      checkinHeatmapData.push(checkHeat);
    });
    let todo : any = bookings;
    //Count booking
    for (const booking of todo) {
      const bookingMoment = moment(booking['start_time']).local();
      bookingHeatmapData[bookingMoment.day()].data[bookingMoment.month()].y += 1;
    }
    //Count Checkin
    todo = checkins;
    for (const checkin of todo) {
      const checkinMoment = moment(checkin['checkin_time']).local();
      checkinHeatmapData[checkinMoment.day()].data[checkinMoment.month()].y += 1;
    }
    setBookingHeatmap(bookingHeatmapData);
    setCheckinHeatmap(checkinHeatmapData);
  }

  function prepareBookCheckData() {
    //init Bar Chart data
    const count = new Map();
    const tempStart = moment(startDate);
    const data = [];
    let todo: any = bookings;

    //Count booking
    for (const booking of todo) {
      const date = moment(booking['start_time']).local().format('YYYY-M-D');

      //Bar Chart
      if (count.has(date)) {
        count.get(date)['booking'] += 1;
      } else count.set(date, { booking: 1, checkin: 0 });
    }
    //Count Checkin
    todo = checkins;
    for (const checkin of todo) {
      const date = moment(checkin['checkin_time']).local().format('YYYY-M-D');
      //Bar Chart
      if (count.has(date)) {
        count.get(date)['checkin'] += 1;
      } else count.set(date, { booking: 0, checkin: 1 });
    }

    do {
      const date = tempStart.format('YYYY-M-D');
      const processed = count.get(date);
      if (processed) {
        data.push({
          date: date,
          Booking: processed.booking,
          'Check-in': processed.checkin,
        });
      } else {
        data.push({
          date: date,
          Booking: 0,
          'Check-in': 0,
        });
      }
      tempStart.add(1, 'day');
    } while (!tempStart.isAfter(endDate, 'day'));

    setBookcheckData(data);
  }
  const [userTypeMapping, setUserTypeMapping] = useState<Map<string, number>>(null);
  const [locationTypeMapping, setLocationTypeMapping] = useState<Map<string, number>>(null);
  const [dayPredictionInput, setDayPredictionInput] = useState<Map<string, number[]>>(null);
  const [dayPredictionResult, setDayPredictionResult] = useState<Map<string, number>>(null);
  const [customizedPredictionInput, setCustomizedPredictionInput] = useState<Map<string, number[]>>(null);
  const [customizedPredictionResult, setCustomizedPredictionResult] = useState<Map<string, number>>(null);
  const [customizedCrowdednessPredictionData, setCustomizedCrowdednessPredictionData] = useState<any[]>(null);
  const [dayCrowdednessPredictionData, setDayCrowdednessPredictionData] = useState<any[]>(null);
  const [dayCheckInPredictionData, setDayCheckInPredictionData] = useState<any[]>(null);

  //Process predicted data for daily prediction plot
  //Prediction for customized period
  // useEffect(() => {
  //   if (customizedPredictionInput) prediction(customizedPredictionInput, setCustomizedPredictionResult).then();
  // }, [customizedPredictionInput]);
  //Process predicted data for customized period prediction plot
  useEffect(() => {
    prepareHeatmapsData();
    prepareBookCheckData();

    if (prediction_result) {
      const counter = new Map<string, any>();
      const checkOutcome = new Map<string, any>();
      const tempStart = moment(predictionDate.startOf('day'));
      const tempEnd = moment(predictionDate.endOf('day'));
      const dataCount = [];
      const dataOutcome = [];
      bookings.forEach((booking) => {
        const bookingID = booking['booking_id'];
        const predicted = prediction_result[bookingID];
        const startTime = moment(booking['start_time']);
        const endTime = moment(booking['end_time']);
        const time = startTime.local().format('HH:mm');
        console.log(startTime.toString())
        console.log(predictionDate.toString())
        console.log(startTime.isSame(predictionDate, 'day'))
        if (startTime.isSame(predictionDate, 'day')) {
          if (checkOutcome.has(time)) {
            switch (predicted) {
              case SUCCESS:
                checkOutcome.get(time)['Success']++;
                break;
              case LATE:
                checkOutcome.get(time)['Late']++;
                break;
              case WALK_IN:
                checkOutcome.get(time)['Walk-in']++;
                break;
              case NO_SHOW:
                checkOutcome.get(time)['No Show']++;
                break;
            }
          } else
            checkOutcome.set(time, {
              Success: predicted === SUCCESS ? 1 : 0,
              Late: predicted === LATE ? 1 : 0,
              'Walk-in': predicted === WALK_IN ? 1 : 0,
              'No Show': predicted === NO_SHOW ? 1 : 0,
            });
          while (startTime.isBefore(endTime)) {
            const tempTime = startTime.local().format('HH:mm');
            if (counter.has(tempTime)) counter.get(tempTime)['Crowdedness'] += predicted === NO_SHOW ? 0 : 1;
            else counter.set(tempTime, {Crowdedness: predicted === NO_SHOW ? 0 : 1});
            startTime.add(30, 'minute');
          }
        }
      });
      do {
        const time = tempStart.format('HH:mm');
        const processedCount = counter.get(time);
        const processedOutcome = checkOutcome.get(time);
        if (processedCount) {
          dataCount.push({
            time: time,
            Crowdedness: processedCount.Crowdedness,
          });
        } else {
          dataCount.push({
            time: time,
            Crowdedness: 0,
          });
        }
        if (processedOutcome) {
          dataOutcome.push({
            time: time,
            Success: processedOutcome.Success,
            Late: processedOutcome.Late,
            'Walk-in': processedOutcome['Walk-in'],
            'No Show': processedOutcome['No Show'],
          });
        } else {
          dataOutcome.push({
            time: time,
            Success: 0,
            Late: 0,
            'Walk-in': 0,
            'No Show': 0,
          });
        }
        tempStart.add(30, 'minute');
      } while (!tempStart.isAfter(tempEnd, 'minute'));

      setDayCrowdednessPredictionData(dataCount);
      setDayCheckInPredictionData(dataOutcome);
}

    if (prediction_result) {
      const counter = new Map<string, any>();
      const tempStart = moment(startDate);
      const data = [];
      bookings.forEach((booking) => {
        const bookingID = booking['booking_id'];
        const predicted = prediction_result[bookingID];
        const date = moment(booking['start_time']).local().format('YYYY-M-D');
        if (counter.has(date)) counter.get(date)['Crowdedness'] += predicted === NO_SHOW ? 0 : 1;
        else counter.set(date, { Crowdedness: predicted === NO_SHOW ? 0 : 1 });
      });

      do {
        const date = tempStart.format('YYYY-M-D');
        const processed = counter.get(date);
        if (processed) {
          data.push({
            date: date,
            Crowdedness: processed.Crowdedness,
          });
        } else {
          data.push({
            date: date,
            Crowdedness: 0,
          });
        }
        tempStart.add(1, 'day');
      } while (!tempStart.isAfter(endDate, 'day'));

      setCustomizedCrowdednessPredictionData(data);
    }
  }, []);

  // //Prediction Process
  // const prediction = async (predInput: Map<string, number[]>, predictionOutput) => {
  //   const model = await tf.loadLayersModel('http://localhost:3000/data/model.json');
  //   const result = new Map<string, number>();
  //   for (const [key, value] of predInput) {
  //     const inputTensor = tf.tensor(value, [1, 5]);
  //     const outputTensor = model.predict(inputTensor) as Tensor;
  //     const output = outputTensor.argMax(1).arraySync() as number[];
  //     result.set(key, output[0]);
  //   }
  //   predictionOutput(result);
  // };

  //Debugging
  // useEffect(() => {
  //   if (dailyBookings) console.log(dailyBookings);
  // }, [dailyBookings]);
  // useEffect(() => {
  //   if (dayPredictionInput) console.log(dayPredictionInput);
  // }, [dayPredictionInput]);
  // useEffect(() => {
  //   if (dayPredictionResult) console.log(dayPredictionResult);
  // }, [dayPredictionResult]);
  // useEffect(() => {
  //   if (customizedPredictionInput) console.log(customizedPredictionInput);
  // }, [customizedPredictionInput]);
  // useEffect(() => {
  //   if (customizedPredictionResult) console.log(customizedPredictionResult);
  // }, [customizedPredictionResult]);
  // useEffect(() => {
  //   if (customizedCrowdednessPredictionData) console.log(customizedCrowdednessPredictionData);
  // }, [customizedCrowdednessPredictionData]);
  useEffect(() => {
    if (dayCrowdednessPredictionData) console.log(dayCrowdednessPredictionData);
  }, [dayCrowdednessPredictionData]);
  useEffect(() => {
    if (dayCheckInPredictionData) console.log(dayCheckInPredictionData);
  }, [dayCheckInPredictionData]);

  //Helpers
  const applyDateRange = () => {
    setStartDate(moment(dateRange[0].startDate).startOf('day'));
    setEndDate(moment(dateRange[0].endDate).endOf('day'));
    setOpenDateSelector(false);
  };

  const handleDateRangeChange = (value) => {
    setSelected(value.target.value);
    switch (value.target.value) {
      case 'custom':
        setOpenDateSelector(!openDateSelector);
        break;
      case 'week':
        setOpenDateSelector(false);
        setStartDate(moment().subtract('1', 'weeks').add(1, 'day').startOf('day'));
        setEndDate(moment().endOf('day'));
        break;
      case 'month':
        setOpenDateSelector(false);
        setStartDate(moment().subtract('1', 'months').add(1, 'day').startOf('day'));
        setEndDate(moment().endOf('day'));
        break;
      case 'quarter':
        setOpenDateSelector(false);
        setStartDate(moment().subtract('1', 'quarters').add(1, 'day').startOf('day'));
        setEndDate(moment().endOf('day'));
        break;
      case 'year':
        setOpenDateSelector(false);
        setStartDate(moment().subtract('1', 'years').add(1, 'day').startOf('day'));
        setEndDate(moment().endOf('day'));
        break;
    }
  };

  return (
    <Layout title="Home">
      <Modal open={openDateSelector} onClose={() => setOpenDateSelector(false)}>
        <Box sx={modalStyle}>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
          />
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button variant="text" onClick={() => setOpenDateSelector(false)}>
              back
            </Button>
            <Button variant="contained" onClick={applyDateRange}>
              apply
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Typography variant="h5">Dashboard</Typography>
        </Grid>
        <Grid item xs justifyContent="flex-end">
          <Box display="flex" justifyContent="flex-end">
            <ToggleButtonGroup color="primary" value={selected} exclusive onChange={handleDateRangeChange} size="small">
              <ToggleButton value={'custom'}>Custom</ToggleButton>
              <ToggleButton value={'week'}>Week</ToggleButton>
              <ToggleButton value={'month'}>Month</ToggleButton>
              <ToggleButton value={'quarter'}>Quarter</ToggleButton>
              <ToggleButton value={'year'}>Year</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Grid>
      </Grid>
      {/*Booking and Check-in Graph*/}
      <Box
        sx={{
          width: '100%',
          height: 500,
          backgroundColor: 'white',
          borderRadius: 5,
          marginTop: 3,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography marginTop={1} variant="subtitle1">
            Heatmap for Booking Records
          </Typography>
        </div>
        <Chart
          options={{
            chart: {
              toolbar: {
                show: false,
              },
            },
            colors: ['#008FFB'],
            plotOptions: {
              heatmap: {
                radius: 5,
              },
            },
          }}
          series={bookingHeatmap}
          type="heatmap"
          height="90%"
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          height: 500,
          backgroundColor: 'white',
          borderRadius: 5,
          marginTop: 3,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography marginTop={1} variant="subtitle1">
            Heatmap for Check-in Records
          </Typography>
        </div>
        <Chart
          options={{
            chart: {
              toolbar: {
                show: false,
              },
            },
            colors: ['#099625'],
            plotOptions: {
              heatmap: {
                radius: 5,
              },
            },
          }}
          series={checkinHeatmap}
          type="heatmap"
          height="90%"
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          height: 500,
          backgroundColor: 'white',
          borderRadius: 5,
          marginTop: 3,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography marginTop={1} variant="subtitle1">
            Booking and Check-in
          </Typography>
        </div>
        <ResponsiveContainer width="100%" height="90%">
          {bookcheckData ? (
            <BarChart data={bookcheckData} barGap={0} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Booking" fill="#8884d8" />
              <Bar dataKey="Check-in" fill="#82ca9d" />
              <Brush dataKey="date" height={30} stroke="#8884d8" />
            </BarChart>
          ) : (
            loading()
          )}
        </ResponsiveContainer>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: 500,
          backgroundColor: 'white',
          borderRadius: 5,
          marginTop: 3,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography marginTop={1} variant="subtitle1">
            Daily Crowdedness Prediction
          </Typography>
        </div>
        <ResponsiveContainer width="100%" height="90%">
          {customizedCrowdednessPredictionData ? (
            <BarChart data={customizedCrowdednessPredictionData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Crowdedness" fill="#8884d8" />
              <Brush dataKey="date" height={30} stroke="#8884d8" />
            </BarChart>
          ) : (
            loading()
          )}
        </ResponsiveContainer>
      </Box>
      <Grid container spacing={2} marginTop={2} justifyContent="flex-end">
        <Grid item xs={3}>
          <Box display="flex">
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DesktopDatePicker
                label="Selected Date"
                inputFormat="dddd, MMMM Do YYYY"
                value={predictionDate}
                onChange={(newDate) => setPredictionDate(newDate)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="space-between">
        {/*Popular Hours*/}
        <Grid item xs={12}>
          <Box
            sx={{
              width: '100%',
              height: 500,
              backgroundColor: 'white',
              borderRadius: 5,
              marginTop: 3,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography marginTop={1} variant="subtitle1">
                Day Crowdedness Prediction
              </Typography>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              {dayCrowdednessPredictionData ? (
                <BarChart data={dayCrowdednessPredictionData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Crowdedness" fill="#8884d8" />
                  <Brush dataKey="time" height={30} stroke="#8884d8" />
                </BarChart>
              ) : (
                loading()
              )}
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              width: '100%',
              height: 500,
              backgroundColor: 'white',
              borderRadius: 5,
              marginTop: 3,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography marginTop={1} variant="subtitle1">
                Day Check-in Status Prediction
              </Typography>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              {dayCheckInPredictionData ? (
                <BarChart
                  data={dayCheckInPredictionData}
                  barGap={0}
                  margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Success" fill="#8884d8" />
                  <Bar dataKey="Late" fill="#82ca9d" />
                  <Bar dataKey="Walk-in" fill="#00FFFF" />
                  <Bar dataKey="No Show" fill="#FF00FF" />
                  <Brush dataKey="time" height={30} stroke="#8884d8" />
                </BarChart>
              ) : (
                loading()
              )}
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Home;

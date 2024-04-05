import {Avatar, Card, CardHeader, Typography} from "@mui/material";
import {red} from "@mui/material/colors";
import moment from 'moment'
import styles from '../../styles/modules/MimiMessage.module.css'
export default function MimiMessage(props) {
    const {message, sx} = props
    return (
    <Card
                                key={message.id}
                                className={styles.wrapper}
                                sx={{...sx}}
                                >
                                <CardHeader
                                    key={message.id}
                                    avatar={<Avatar sx={{bgcolor: red[500]}} aria-label="chat">
                                        {message.sender.charAt(0)}
                                    </Avatar>}
                                    title={<div style={{overflow: "hidden", textOverflow: "ellipsis", width: '11rem'}}>
                                        <Typography sx={{
                                            fontSize: '1rem', color: 'black', '@media (max-width: 600px)': {
                                                fontSize: '1rem',
                                            }, '@media (max-width: 400px)': {
                                                fontSize: '0.8rem',
                                            }, '@media (max-width: 300px)': {
                                                fontSize: '0.7rem',
                                            }, '@media (max-width: 200px)': {
                                                fontSize: '0.6rem',
                                            },
                                        }}
                                        >
                                            {message.message}
                                        </Typography>
                                    </div>}
                                    subheader={<>
                                        <div>
                                            <Typography>{message.sender}</Typography>
                                        </div>
                                        <div>
                                            <Typography>{moment(message.datetime).fromNow()}</Typography>
                                        </div>
                                    </>}
                                >
                                </CardHeader>
                            </Card>
    )
}
 
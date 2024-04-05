import {Icon} from "@mui/material";
import * as React from "react";

/**
 *  This is a component for the Locale Icon
 * @param props - inputProps: {placeholder, setPlaceholder, mode, setMode, locale, setLocale}
 * @returns {Element}
 * @constructor
 */
export function LocaleIcon(props) {
    return (<>
        <Icon fontSize='default' {...props}
              sx={{
                  borderRadius: '50%',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
              }}
        >
            <LocaleIconSvg/>
            {{
                false: (
                    <p style={{
                        position: 'absolute',
                        top: '65%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#ffffff',
                        fontSize: '0.6rem',
                        fontFamily: 'Roboto',
                    }}>{props.inputprops.locale}</p>
                )
            }[props.inputprops.isLocaleDropdownOpen]}


        </Icon>

        {{
            true: (
                <div style={{
                    position: 'absolute',
                    top: '-150%',
                    left: '10%',
                    transform: 'translate(-50%, 0)',
                    backgroundColor: '#ffffff',
                    borderRadius: '5px',
                    padding: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    zIndex: 100,
                    boxShadow: '0 0 10px 0 rgba(0,0,0,0.5)',

                }}>
                    <button
                        style={{
                            scale: 1,
                            color: '#000000',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            padding: '5px',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            textAlign: 'center',
                            textDecoration: 'none',
                            display: 'inline-block',
                            transition: '2s',
                        }}
                        onClick={() => {
                            props.inputprops.setLocale('EN');
                            props.inputprops.setIsLocaleDropdownOpen(false);
                            props.inputprops.setPlaceholder(props.inputprops.mode === 'voice' ? props.inputprops.enVoice : props.inputprops.enText);
                            props.inputprops.changeLocale('EN')
                        }}>English
                    </button>
                    <button
                        style={{
                            scale: 1,
                            color: '#000000',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            padding: '5px',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            textAlign: 'center',
                            textDecoration: 'none',
                            display: 'inline-block',
                            transition: '2s',
                        }}
                        onClick={() => {
                            props.inputprops.setLocale('RU');
                            props.inputprops.setIsLocaleDropdownOpen(false);
                            props.inputprops.setPlaceholder(props.inputprops.mode === 'voice' ? props.inputprops.ruVoice : props.inputprops.ruText);
                            props.inputprops.changeLocale('RU')
                        }}>Russian
                    </button>
                </div>
            ),
            false: null
        }[props.inputprops.isLocaleDropdownOpen]}

    </>);


}

export function LocaleIconSvg() {
    return (<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 24 24" width="100%"
                 preserveAspectRatio="none">
        <path
            fill={'#ffffff'}
            d="M21 4H11l-1-3H3c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h8l1 3h9c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7 16c-2.76 0-5-2.24-5-5s2.24-5 5-5c1.35 0 2.48.5 3.35 1.3L9.03 8.57c-.38-.36-1.04-.78-2.03-.78-1.74 0-3.15 1.44-3.15 3.21S5.26 14.21 7 14.21c2.01 0 2.84-1.44 2.92-2.41H7v-1.71h4.68c.07.31.12.61.12 1.02C11.8 13.97 9.89 16 7 16zm6.17-5.42h3.7c-.43 1.25-1.11 2.43-2.05 3.47-.31-.35-.6-.72-.86-1.1l-.79-2.37zm8.33 9.92c0 .55-.45 1-1 1H14l2-2.5-1.04-3.1 3.1 3.1.92-.92-3.3-3.25.02-.02c1.13-1.25 1.93-2.69 2.4-4.22H20v-1.3h-4.53V8h-1.29v1.29h-1.44L11.46 5.5h9.04c.55 0 1 .45 1 1v14z"/>
    </svg>);
}
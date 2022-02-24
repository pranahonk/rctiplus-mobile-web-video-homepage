import React from 'react'
import Router from 'next/router'
import "../../../../assets/scss/components/headerHomeCategory.scss"

export default function Header({title}) {
    return (
        <div className="header-container">
            <div onClick={() => Router.back()}>
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M24 6.66667H5.10667L9.88 1.88L8 0L0 8L8 16L9.88 14.12L5.10667 9.33333H24V6.66667Z" fill="white"/>
                </svg>
            </div>
            <div className="header-title">{title}</div>
            <div></div>
        </div>
    )
}

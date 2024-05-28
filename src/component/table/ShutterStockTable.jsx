import React, { useEffect, useState } from 'react'
import { DarkParagraph, LightParagraph } from '../typhography/Typography'


const ShutterStockTable = ({ data }) => {

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setTableData(data)
    }, [data])
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th className='min-w-200'>
                            <LightParagraph size='xs'>Keyword</LightParagraph>
                        </th>
                        <th>
                            <LightParagraph size='xs'>SearchUrl (Please Visit The Below Link To Get The Id Of The Image You Want To Map)</LightParagraph>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData.map((tableRow, index) => {
                            const { keyword, searchUrl } = tableRow;
                            return (
                                <tr key={index}>
                                    <td>
                                        <DarkParagraph size='xs'>{keyword}</DarkParagraph>
                                    </td>
                                    <td>
                                        <LightParagraph size='xs'><a href={searchUrl} target="_blank" className='link'>{searchUrl}</a></LightParagraph>
                                    </td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>

        </div>
    )
}

export default ShutterStockTable
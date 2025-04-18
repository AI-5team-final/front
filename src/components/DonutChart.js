

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function DonutChart({matchResult}) {
    const COLORS = ['#013A72', '#f5f5f5'];
    const score = parseInt(matchResult.total_score);
    const data = [
        { name: '매칭', value: score },
        { name: '미매칭', value: 100 - score },
    ];

    return (
        <div className='total' style={{ position: 'relative'}}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="90%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        animationDuration={400}
                        animationEasing="ease-in-out"
                    >
                        {data.map((_, i) => (
                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        
            <div className='total-inner'>
                <p>Ai 매칭</p>
                <p className="score">{score}<span>점</span></p>
            </div>
            
        </div>
    );
}

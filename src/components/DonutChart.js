import { ResponsivePie } from '@nivo/pie';

const DonutChart = ({matchResult}) => {
    const score = matchResult.total_score;
    const data = [
      { id: '매칭', label: '매칭', value: score },
      { id: '미매칭', label: '미매칭', value: 100 - score },
    ];

    return(
        <div className='total'>
            <ResponsivePie
            data={data}
            innerRadius={0.9}
            enableArcLabels={false} 
            enableArcLinkLabels={false}
            colors={['#013A72', '#f5f5f5']}
            />
                <div className='total-inner'>
                    <p>Ai 매칭</p>
                    <p className="score">{score}<span>점</span></p>
                </div>
        </div>
    );
  
};

export default DonutChart;
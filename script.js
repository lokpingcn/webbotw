let rawData = [];

// 加载数据
async function loadData() {
    if (!rawData.length) {
        try {
            const response = await fetch('botw_data.json');
            rawData = await response.json();
        } catch (error) {
            console.error('数据加载失败:', error);
        }
    }
}

// 生成支持项内容
function generateSupports(item) {
    const supportKeys = ['盾防', '盾滑', '速射', '狙击', '多发弓', '投掷', '暴击', '耐久'];
    const supports = supportKeys.filter(key => item[key]).join('、');
    return supports || '无';
}

// 生成卡片
function generateCard(item) {
    const hexValue = parseInt(item.二进制, 2).toString(16).toUpperCase().padStart(8, '0');
    const supports = generateSupports(item);
    return `
        <div class="card">
            <h3>属性值: ${item.属性值}</h3>
            <p><strong>支持:</strong> ${supports}</p>
            <p><strong>材料:</strong> ${item.材料1 || ''}, ${item.材料2 || ''}, ${item.材料3 || ''}, ${item.材料4 || ''}, ${item.材料5 || ''}</p>
            <p><strong>替代材料:</strong> ${item.替代1 || ''}, ${item.替代2 || ''}, ${item.替代3 || ''}, ${item.替代4 || ''}, ${item.替代5 || ''}</p>
            <p><strong>售价:</strong> ${item.售价}</p>
            <p><strong>十六进制:</strong> ${hexValue}</p>
            <p><strong>强持个数:</strong> ${item.强持个数}</p>
            <p><strong>效果类型:</strong> ${item.效果类型}</p>
        </div>`;
}

// 显示结果
function displayResults(data) {
    const resultsContainer = document.getElementById('results-cards');
    resultsContainer.innerHTML = '';

    if (data.length === 0) {
        resultsContainer.innerHTML = '<p>没有符合条件的结果</p>';
        return;
    }

    data.forEach(item => {
        resultsContainer.innerHTML += generateCard(item);
    });
}

// 筛选逻辑
function filterResults() {
    let filtered = rawData;

    document.querySelectorAll('.filter').forEach((filter) => {
        const key = filter.id.replace('filter-', '');
        const value = filter.value;
        if (value) {
            filtered = filtered.filter((item) => {
                if (key === '强持个数') {
                    return item[key] === parseInt(value, 10); // 匹配整数
                }
                if (value === 'true' || value === 'false') {
                    return item[key] === (value === 'true'); // 匹配布尔值
                }
                return item[key] === value; // 默认匹配字符串
            });
        }
    });

    return filtered;
}

// 点击搜索按钮事件
document.getElementById('search-button').addEventListener('click', async () => {
    await loadData(); // 加载数据
    const results = filterResults(); // 筛选数据
    displayResults(results); // 显示结果
});
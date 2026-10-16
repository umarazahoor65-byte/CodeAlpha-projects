
    let expression   = '';   
    let justEvaled   = false; 

    const exprEl   = document.getElementById('expression');
    const resultEl = document.getElementById('result');

    function updateDisplay() {
        exprEl.textContent = expression;
        resultEl.classList.toggle('small', resultEl.textContent.length > 10);
    }

    function setResult(val) {
        resultEl.textContent = val;
        resultEl.classList.toggle('small', String(val).length > 10);
    }

    function lastChar() {
        return expression.slice(-1);
    }

    function endsWithOp() {
        return ['+', '-', '*', '/', '%'].includes(lastChar());
    }

    // input handler
    function inputNum(n) {
        if (justEvaled) {
            expression = '';
            justEvaled = false;
        }
        expression += n;
        setResult(expression);
        updateDisplay();
    }

    function inputOp(op) {
        if (justEvaled) {
            justEvaled = false;
        }
        if (expression === '' && op !== '-') return; 
        if (endsWithOp()) {
            expression = expression.slice(0, -1);
        }
        expression += op;
        setResult(op);
        updateDisplay();
    }

    function inputDot() {
        if (justEvaled) { expression = '0'; justEvaled = false; }

        const parts = expression.split(/[\+\-\*\/\%]/);
        const currentNum = parts[parts.length - 1];

        if (currentNum.includes('.')) return;

        if (currentNum === '') expression += '0';
        expression += '.';
        setResult(expression);
        updateDisplay();
    }

    function deleteLast() {
        if (justEvaled) { clearAll(); return; }
        expression = expression.slice(0, -1);
        setResult(expression || '0');
        updateDisplay();
    }

    function clearAll() {
        expression = '';
        justEvaled = false;
        setResult('0');
        exprEl.textContent = '';
    }

    function calculate() {
        if (expression === '' || endsWithOp()) return;
        try {
            const result = Function('return ' + expression)();
            exprEl.textContent = expression + ' =';
            const display = parseFloat(result.toFixed(10));
            setResult(display);
            expression = String(display);
            justEvaled = true;
        } catch (e) {
            setResult('Error');
            expression = '';
        }
    }

    // keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') inputNum(e.key);
        else if (['+', '-', '*', '/', '%'].includes(e.key)) inputOp(e.key);
        else if (e.key === '.') inputDot();
        else if (e.key === 'Enter' || e.key === '=') calculate();
        else if (e.key === 'Backspace') deleteLast();
        else if (e.key === 'Escape') clearAll();
    });
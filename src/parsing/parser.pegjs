Entry 
  = pathArray:Path* {
    return options.queryBuilder.buildPathCombination(pathArray);
  }

Path 
  = identifiers:(PathPart)+ WhiteSpace filter:(Filter)? {
    return options.queryBuilder.buildPath(identifiers, filter);
  }
  / identifiers:(PathPart)* WhiteSpace filter:(Filter) {
    return options.queryBuilder.buildPath(identifiers, filter);
  }

PathPart
 = Property
 / Indexer

Property 
  = memberCharacter:MemberCharacter name:MemberName {
    return options.queryBuilder.buildIdentifier(name, memberCharacter === '|');
  }

Source 
  = MemberName

Filter 
 = "{" WhiteSpace filter:FilterContent WhiteSpace "}" {
   return filter;
 }

MemberCharacter 
  = "."
  / "|"

FilterContent 
 = startFilterScope:FilterScope additionalFilterScopes:LogicalOperatorPlusFilterScope* WhiteSpace  {
  return options.queryBuilder.buildFilterContent(startFilterScope, additionalFilterScopes);
}

CombinedFilter = startFilter:FilterComparison additionalFilters:LogicalOperatorPlusSomething* WhiteSpace {
  return options.queryBuilder.buildCombinedFilter(startFilter, additionalFilters);
}

ParenthesisFilter = WhiteSpace "(" combinedFilter:FilterScope ")" WhiteSpace {
  return options.queryBuilder.buildParenthesis(combinedFilter);
}

FilterScope 
  = ParenthesisFilter
  / CombinedFilter

LogicalOperatorPlusSomething
  = LogicalOperatorPlusComparer 
  / LogicalOperatorPlusFilterScope

LogicalOperatorPlusFilterScope
 = WhiteSpace operator:LogicalOperator WhiteSpace filterScope:FilterScope {
   return options.queryBuilder.buildOperatorPlusFilterScope(operator, filterScope);
 }

LogicalOperatorPlusComparer
 = WhiteSpace operator:LogicalOperator WhiteSpace comparer:FilterComparison {
   return options.queryBuilder.buildOperatorPlusComparer(operator, comparer);
 }

LogicalOperator
  = LogicalAnd
  / LogicalOr

LogicalAnd "&&" 
 = "&&"

 LogicalOr "||"
 = "||"

FilterComparison
  = left:FilterComparisonSide WhiteSpace comparer:CompareOperator WhiteSpace right:FilterComparisonSide {
   return options.queryBuilder.buildComparison(left, comparer, right);
 }

FilterComparisonSide
  = value:Value {
   return options.queryBuilder.buildValue(value); 
  }
  / Path

MemberName 
  = head:LetterWithoutNumber tail:LetterWithNumber* { 
      return head + (tail ? tail.join('') : '');
    }
  /StringLiteral

Indexer 
  = '[' WhiteSpace index:Index WhiteSpace ']' {
    return options.queryBuilder.buildIdentifier(index, false);
  }

Index 
  = StringLiteral
  / Integer


LetterWithoutNumber
  = [a-zA-Z$]

LetterWithNumber
  = [a-zA-Z0-9]

WhiteSpace "whitespace" 
  = [ \t\n\r]*

StringLiteral "string"
  = '"' chars:DoubleStringCharacter* '"' { return chars.join(''); }
  / "'" chars:SingleStringCharacter* "'" { return chars.join(''); }

DoubleStringCharacter
  = !('"' / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter
  = !("'" / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

EscapeSequence
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b";   }
  / "f"  { return "\f";   }
  / "n"  { return "\n";   }
  / "r"  { return "\r";   }
  / "t"  { return "\t";   }
  / "v"  { return "\x0B"; }

CompareOperator
  = '<='
  / '<'
  / '>='
  / '>'
  / ':'
  / '!=='
  / '!='
  / '==='
  / '=='

Value 
  = Number 
  / StringLiteral
  / TrueToken { return true}
  / FalseToken {return false}
  / NullToken { return null}

Number 
  = left:([0-9] '.')? right:[0-9]+ {
    if (left && left.length) {
      return parseFloat(left.join('') + right.join(''), 10);
    } 
    
    return parseInt(right.join(''), 10);
  }

Integer
  = chars:[0-9]+ {
    return parseInt(chars.join(''), 10);
  }

TrueToken "true"
  = "true"

FalseToken "false"
  = "false"

NullToken "null"
  = "null"
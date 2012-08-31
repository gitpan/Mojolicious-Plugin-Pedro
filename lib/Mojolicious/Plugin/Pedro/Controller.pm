package Mojolicious::Plugin::Pedro::Controller;
use Mojo::Base 'Mojolicious::Controller';

our $VERSION = '0.02';

sub line_tokens {
    my $self = shift;
    my $line = $self->param('line') || '';

    my @tokens = ();

    require PPI;
    my $doc = PPI::Document->new( \$line );
    my $doc_tokens = $doc->find('PPI::Token');
    require Params::Util;
    if ( Params::Util::_ARRAY0($doc_tokens) ) {

        for my $token (@$doc_tokens) {
            my $type    = 'text';
            my $content = $token->content;
            if ( $token->isa('PPI::Token::Word') ) {
                if (   $content eq 'my'
                    || $content eq 'use'
                    || $content eq 'say'
                    || $content eq 'print' )
                {
                    $type = 'keyword';
                }
                else {
                    $type = 'variable';
                }
            }
            elsif ( $token->isa('PPI::Token::Operator') ) {
                $type = 'keyword.operator';
            }
            elsif ( $token->isa('PPI::Token::Quote') ) {
                $type = 'string';
            }
            elsif ( $token->isa('PPI::Token::Comment') or $token->isa('PPI::Token::Pod')) {
                $type = 'comment';
            }
            elsif ( $token->isa('PPI::Token::Number') ) {
                $type = 'constant.numeric';
            }
            elsif ( $token->isa('PPI::Token::Number') ) {
                $type = 'constant.numeric';
            }
            
            push @tokens, { type => $type, value => $content };
        }
    }
    else {
        push @tokens, { type => "text", value => $line };
    }

    $self->render( json => \@tokens );
}

sub default {
    my $self = shift;

    # Render template "controller/default.html.ep"
    $self->render;
}

1;
